var path = require("path");
module.exports = {
    devServer: {
        historyApiFallback: true
    },
    output: {
        path: path.resolve(__dirname, "bin"),
        filename: "bundle.js"
    }
};