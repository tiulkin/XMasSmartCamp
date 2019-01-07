/* eslint-disable no-param-reassign */
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminOptipng = require('imagemin-optipng');
const imageminJpegtran = require('imagemin-jpegtran');
// const SvgStore = require('webpack-svgstore-plugin');
// const imageminSvgo = require('imagemin-svgo');
// ^ Глючат на <use xlink:href=... Заменены на SVGSpritemapPlugin
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer');
const pcssBaseurl = require('./postcss/baseurl');
const webpack = require('webpack');
const path = require('path');
const pluginsFactory = {};
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

class FilterPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tap('FilterPlugin', compilation => {
            compilation.warnings = compilation.warnings.filter(warning => !this.options.filter.test(warning.message));
        });
    }
}
pluginsFactory.contextReplacementPlugin = () => {
    return new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru|en/);
};
pluginsFactory.filterPlugin = () => {
    return new FilterPlugin({
        filter: /chunk styles \[mini-css-extract-plugin]\nConflicting order between:/
    });
};
pluginsFactory.cleanWebpackPlugin = params => {
    return new CleanWebpackPlugin([params.publicPath], {
        root: path.resolve(__dirname, '..', '..'),
        verbose: true
    });
};
pluginsFactory.SVGSpritemapPlugin = () => {
    return new SVGSpritemapPlugin('./src/**/images/**/*.svg', {
        output: { filename: './images/sprite-svg.svg' },
        sprite: { prefix: false }
    });
};
pluginsFactory.copyWebpackPlugins = () => {
    return [
        new CopyWebpackPlugin([
            {
                from: 'images/**/*.{svg,png,pdf,jpg,mp3,bin,mp4}',
                to: './',
                context: './src/'
            },
            {
                from: 'fonts/**/*.{eot,svg,ttf,woff,woff2}',
                to: './',
                context: './src/'
            },
            {
                from: 'meta/**/*.*',
                to: './',
                context: './src/'
            },
            {
                from: 'version.json',
                to: './',
                context: './src/constants/'
            },
            {
                from: '*.html',
                to: './',
                context: './src/'
            },
            {
                from: '.well-known/**/*',
                to: './',
                context: './src/'
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: './src/**/images/**/*.{svg,png,pdf,jpg,mp3,bin,mp4,mem}',
                to: './images/',
                flatten: true
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: './src/styles/*.css',
                to: './css/',
                flatten: true
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: './src/builds.json',
                to: './'
            }
        ])
    ];
};
pluginsFactory.loaderOptionsPlugin = params => {
    return new webpack.LoaderOptionsPlugin({
        options: {
            stylus: {
                use: [
                    poststylus([
                        autoprefixer({
                            browsers: [
                                'last 10 chrome versions',
                                'last 5 Safari versions',
                                'last 5 Firefox versions',
                                'last 3 Edge versions',
                                'IE >= 10'
                            ]
                        }),
                        pcssBaseurl({
                            base: params.BaseHREF
                        })
                    ])
                ],
                import: [path.resolve('./src/styles/variables.styl')],
                sourceMap: true
            }
        }
    });
};
pluginsFactory.namedModulesPlugin = () => {
    return new webpack.NamedModulesPlugin();
};
pluginsFactory.namedChunksPlugin = () => {
    return new webpack.NamedChunksPlugin(chunk => {
        if (chunk.name) {
            return chunk.name;
        }
        return Array.from(chunk.modulesIterable, m => {
            const pathComponents = m.request.split('/');

            return pathComponents[pathComponents.length - 1];
        }).join('_');
    });
};

pluginsFactory.imageMinPlugins = () => {
    return [
        new ImageminPlugin({
            test: /\.(jpe?g)$/i,
            plugins: [imageminJpegtran({ progressive: true })]
        }),
        new ImageminPlugin({
            test: /\.(png)$/i,
            plugins: [imageminOptipng({ optimizationLevel: 5 })]
        })
    ];
};

pluginsFactory.miniCssExtractPlugin = params => {
    return new MiniCssExtractPlugin({
        filename: params.isRunWithDevServer ? 'css/devbundle.css' : 'css/[hash]/[name].[hash].css'
    });
};

pluginsFactory.deadCodePlugin = params => {
    return new webpack.DefinePlugin({
        DEADCODE: true,
        'process.env': JSON.stringify(params)
    });
};

pluginsFactory.htmlWebpackPlugin = params => {
    return new HtmlWebpackPlugin({
        chunks: [params.isRunWithDevServer ? 'app' : 'loader'],
        template: 'src/webpack.html',
        variables: {
            BaseHREF: params.BaseHREF
        }
    })
};

pluginsFactory.bundleAnalyzerPlugin = () => {
    return new BundleAnalyzerPlugin({
        analyzerMode: 'static'
    });
};

module.exports = pluginsFactory;
