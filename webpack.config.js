import webpack from 'webpack';
import path from 'path';

export default {
    devtool: 'inline-source-map',

    entry: {
        'indexBundle': path.resolve(__dirname, 'public/index.js'),
        'accountBundle': path.resolve(__dirname, 'public/account.js')
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
}
