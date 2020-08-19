const path = require('path');
const htmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app/interaction.js',
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'docs'),
    },
    plugins: [
        new htmlWebPackPlugin({
            template: './src/index.html'
        })
    ],
};