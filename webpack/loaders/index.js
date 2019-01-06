const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const loadersFactory = {};

loadersFactory.ignoreLoader = () => {
    return {
        test: /\.(svg|png|pdf|jpg|mp3|bin|mp4|mem)$/,
        loader: 'ignore-loader'
    };
};

loadersFactory.prettierLoader = () => {
    return {
        test: /\.jsx$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: path.resolve('./webpack/loaders/prettier/prettier.loader.js')
    };
};

loadersFactory.babelWithHotLoader = () => {
    return {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    browsers: [
                                        'last 10 chrome versions',
                                        'last 5 Safari versions',
                                        'last 5 Firefox versions',
                                        'last 3 Edge versions',
                                        'IE >= 10'
                                    ]
                                }
                            }
                        ],
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        '@babel/plugin-syntax-dynamic-import',
                        'react-hot-loader/babel'
                    ]
                }
            },
            'eslint-loader'
        ]
    };
};

loadersFactory.babelWithoutHotLoader = () => {
    return {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    browsers: [
                                        'last 10 chrome versions',
                                        'last 5 Safari versions',
                                        'last 5 Firefox versions',
                                        'last 3 Edge versions',
                                        'IE >= 10'
                                    ]
                                }
                            }
                        ],
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        '@babel/plugin-syntax-dynamic-import'
                    ]
                }
            }
        ]
    };
};

loadersFactory.cssHotLoader = () => {
    return {
        test: /\.(styl|css)$/,
        use: [
            'css-hot-loader',
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    url: false
                }
            },
            'stylus-loader'
        ]
    };
};

loadersFactory.cssLoader = () => {
    return {
        test: /\.(styl|css)$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    };
};

module.exports = loadersFactory;
