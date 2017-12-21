import express from 'express';
import path from 'path';
import webpack from 'webpack';
import config from '../webpack.config';
import bodyParser from 'body-parser';

const app = express();
const compiler = webpack(config);
app.use(bodyParser.urlencoded( {extended: true} ));

const PORT = 8080;

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/account.html'))
});

app.post('/login', (req, res) => {
    res.send('POST request');
    console.log(req.body);
});

app.listen(PORT, () => {
    console.log("Test server on Port " + PORT);
});
