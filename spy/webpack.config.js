const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BUILD_DIR = path.resolve(__dirname, "../extension/out/spy");

module.exports = {
    output: {
        path: BUILD_DIR,
        filename: "bundle.js"
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'bin/*' }
        ])
    ]
};