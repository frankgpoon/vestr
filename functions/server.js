import express from 'express';
import path from 'path';
import webpack from 'webpack';
import config from '../webpack.config';
import bodyParser from 'body-parser';
import fs from 'fs';
import http from 'http';
import https from 'https';
import mysql from 'mysql';

// Constants set for running the server
const app = express();
const compiler = webpack(config);

// Constants set by myself for convenience
const HTTPPORT = 8080;
const HTTPSPORT = 8443;

// Enable HTTPS for cert
var certificate = fs.readFileSync('/secretstuff/vestr/fullchain.pem', 'utf8');
var privateKey = fs.readFileSync('/secretstuff/vestr/privkey.pem', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};

// MySQL stuff
var connection = mysql.createConnection(
    JSON.parse(fs.readFileSync('/secretstuff/vestr/mysql-config.json', 'utf-8'))
);

connection.connect((err) => {
    if (err) {
        console.log('error: ' + err.stack);
        return;
    }
    console.log('connected as id' + connection.threadId);
});

connection.end();

// Helps
app.use(bodyParser.urlencoded( {extended: true} ));

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

// Handles loading GET
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/account.html'))
});

// Handles loading POST
app.post('/login', (req, res) => {
    res.send('/login POST request');
    console.log(req.body);
});

app.post('/register', (req, res) => {
    res.send('/register POST request');
    console.log(req.body);
    console.log(typeof req.body);
});

// starts server in both HTTP and HTTPS (may remove HTTP later)
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials , app);

httpServer.listen(HTTPPORT, () => {
    console.log('HTTP server started at ' + HTTPPORT);
});
httpsServer.listen(HTTPSPORT, () => {
    console.log('HTTPS server started at ' + HTTPSPORT);
});
