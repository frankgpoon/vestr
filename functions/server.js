import express from 'express';
import path from 'path';
import webpack from 'webpack';
import config from '../webpack.config';
import bodyParser from 'body-parser';
import fs from 'fs';
import http from 'http';
import https from 'https';

const app = express();
const compiler = webpack(config);

app.use(bodyParser.urlencoded( {extended: true} ));

const HTTPPORT = 8080;
const HTTPSPORT = 8443;

var certificate = fs.readFileSync('/etc/letsencrypt/live/vestr.frankpoon.com/fullchain.pem', 'utf8');
var privateKey = fs.readFileSync('/etc/letsencrypt/live/vestr.frankpoon.com/privkey.pem', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
}

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

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials , app);

httpServer.listen(HTTPPORT);
httpsServer.listen(HTTPSPORT);
