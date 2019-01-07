/* eslint-disable no-bitwise */
// --------------------------------------------------------------------------------------------
// Конфигурации сборки описываются в deploy.json и/или deployConfigs. Эти файлы содержат внешние
// параметры сборки, такие как адреса API, необходимость включать GA, режим сборки вебпака и т.д..
// Набор лоадеров и плагинов для каждой конфигурации описан в loaders/bundles.json и
// plugins/bundles.json соответсвенно. Сами плагины импортируются и/или формируются в фабриках
// loaders/index.js и plugins/index.js.
// Плагины и лоадеры имеют битовую маску, согласно которой включаются или нет для работы на девсервере
// devServerMode - Первый бит - девсервер
//                 Второй бит - билд
//                 undefined,0,null - игнорится всегда
// --------------------------------------------------------------------------------------------
// Отладка этого файла:
// С девсервером: node-nightly --inspect-brk ./node_modules/webpack-dev-server/bin/webpack-dev-server --progress --profile --colors --inline --hot --deploy=predprod --config=webpack/webpack.config.js
// Сборка: node-nightly --inspect-brk ./node_modules/webpack/bin/webpack --progress --profile --colors --inline --deploy=predprod --config=webpack/webpack.config.js
// После запуска в chrome://inspect выбираем node
// --------------------------------------------------------------------------------------------
// Сборки создают файлы в public, запуск с devserver в publicDev
// --------------------------------------------------------------------------------------------
// При запуске start_memory_fs devserver не создает физических файлов вообще, Если что-то
// есть в этот момент в public, значит оно осталось от прошлой сборки. Файлы хранятся в памяти
// (https://github.com/webpack/memory-fs). Доступ к файлом через http://localhost:3000/webpack-dev-server

const webpack = require('webpack');
const path = require('path');
const argv = require('yargs').argv;
const pluginsFactory = require('./plugins');
const pluginBundles = require('./plugins/bundles.json');
const loadersFactory = require('./loaders');
const loadersBundles = require('./loaders/bundles.json');

let deployJSON;

// --------------------------------------------------------------------------------------------
// Получаем конфиг. Сначала смотрим deploy.json, если его нет, то ,берем deployConfigs
// и из него выбираем конфиг с ключем равным параметру --deploy
// --------------------------------------------------------------------------------------------
try {
    deployJSON = require('./deploy.json');
    console.log('loading custom config: deploy.json');
} catch (error) {
    const deployEnv = (argv.deploy && argv.deploy.toString()) || 'predprod';

    deployJSON = require('./deployConfigs')[deployEnv];
}
const isRunWithDevServer = argv.$0.indexOf('webpack-dev-server') !== -1;
const publicPath = isRunWithDevServer ? 'publicDev' : 'public';
const deployConfig = { ...deployJSON, isRunWithDevServer, publicPath };
const { BaseHREF, mode } = deployConfig;
const webpackConfig = {
    entry: {
        app: ['@babel/polyfill', './src/Index.jsx'],
        loader: ['@babel/polyfill', './src/loader.jsx']
    },
    output: {
        filename: isRunWithDevServer ? 'js/[name].js' : 'js/[hash]/[name].[hash].js',
        publicPath: BaseHREF,
        path: path.resolve(`./${publicPath}${BaseHREF}`)
        // jsonpFunction : `jsonpFunction${Math.random()}`
    },
    mode,
    optimization: {
        runtimeChunk: isRunWithDevServer,
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '-',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 1,
                    priority: -20,
                    reuseExistingChunk: true
                },
                styles: {
                    name: 'styles',
                    test: /\.(styl|css)/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: { rules: [] },
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '*'],
        alias: {
            framework: path.resolve('./src/framework'),
            constants: path.resolve('./src/constants'),
            components: path.resolve('./src/components'),
            modules: path.resolve('./src/modules'),
            reducers: path.resolve('./src/reducers'),
            actions: path.resolve('./src/actions'),
            apps: path.resolve('./src/apps'),
            shared: path.resolve('./src/shared'),
            dataExamples: path.resolve('./src/dataExamples'),
            __mocks__: path.resolve('./src/__mocks__'),
            pnp: path.resolve('./src/pnp')
        }
    },
    plugins: []
};

// --------------------------------------------------------------------------------------------
// Выбираем соответствующие конфигу плагины
// --------------------------------------------------------------------------------------------
const plugins = Array.isArray(pluginBundles[mode]) ? [...pluginBundles.general, ...pluginBundles[mode]] : pluginBundles.general;

plugins.forEach(pluginParams => {
    const plugin = pluginsFactory[pluginParams.name](deployConfig);
    debugger;
    if ((isRunWithDevServer && pluginParams.devServerMode & 1) || (!isRunWithDevServer && pluginParams.devServerMode & 2)) {
        // линтер сдох на тренарнике с ...plugin поэтому if )
        if (Array.isArray(plugin)) {
            webpackConfig.plugins.push(...plugin);
        } else {
            webpackConfig.plugins.push(plugin);
        }
    }
});

// --------------------------------------------------------------------------------------------
// Выбираем соответствующие конфигу лоадеры
// --------------------------------------------------------------------------------------------
const loaders = Array.isArray(loadersBundles[mode])
    ? [...loadersBundles.general, ...loadersBundles[mode]]
    : loadersBundles.general;

loaders.forEach(loaderParams => {
    const loader = loadersFactory[loaderParams.name](deployConfig);

    if ((isRunWithDevServer && loaderParams.devServerMode & 1) || (!isRunWithDevServer && loaderParams.devServerMode & 2)) {
        if (Array.isArray(loader)) {
            webpackConfig.module.rules.push(...loader);
        } else {
            webpackConfig.module.rules.push(loader);
        }
    }
});

// --------------------------------------------------------------------------------------------
// Отключаем чанки если надо
// --------------------------------------------------------------------------------------------

if (argv.chanks === false) {
    webpackConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
}

// --------------------------------------------------------------------------------------------
// Добавляем настройки девсервер
// --------------------------------------------------------------------------------------------

if (isRunWithDevServer) {
    webpackConfig.devServer = {
        hot: true,
        inline: true,
        contentBase: path.resolve(`./${publicPath}`),
        historyApiFallback: true,
        port: 3000,
        compress: true
    };
}
console.log('Final config:', webpackConfig);
module.exports = webpackConfig;
