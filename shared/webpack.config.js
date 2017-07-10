const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, "lib");
const APP_DIR = path.resolve(__dirname, "src");
console.error(APP_DIR);
const config = {
    entry: [APP_DIR + "/index.ts"],
    devtool: "cheap-module-source-map",
    output: {
        path: BUILD_DIR,
        filename: "xcomponent-shared.js",
        publicPath: "/",
        libraryTarget: "commonjs2",
        library: "xcomponent-shared"
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        modules: [
            "node_modules",
            "src"]
    },
    plugins: process.env.NODE_ENV === "production" ? [
        new ExtractTextPlugin({
            filename: '[name].[contenthash:16].css',
            allChunks: true
        }),
        new CleanWebpackPlugin([BUILD_DIR, "test_output", "coverage"], {
            root: __dirname,
            verbose: true,
            dry: false,
            exclude: []
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            minimize: true
        })
    ] : [
            new ExtractTextPlugin({
                filename: '[name].[contenthash:16].css',
                allChunks: true
            }),
            new CleanWebpackPlugin([BUILD_DIR, "test_output", "coverage"], {
                root: __dirname,
                verbose: true,
                dry: false,
                exclude: []
            })
        ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.tsx?$/,
                enforce: "pre",
                loader: "tslint-loader",
                options: {
                    typeCheck: false,
                    configFile: false,
                    failOnHint: true
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            }
                        },
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                includePaths: [
                                    __dirname + '/node_modules'
                                ],
                                outputStyle: 'compressed'
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        query: {
                            progressive: true,
                            bypassOnDebug: true,
                            optipng: {
                                optimizationLevel: 4,
                            },
                            mozjpeg: {
                                optimizationLevel: 4,
                                speed: 4
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            }
                        }
                    }
                ]
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            }
        ]
    }
};

module.exports = config;

