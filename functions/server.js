import express from 'express';
import path from 'path';
import webpack from 'webpack';
import config from '../webpack.config';
import bodyParser from 'body-parser';
import fs from 'fs';
import http from 'http';
import https from 'https';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import passport from 'passport';
import passportLocal from 'passport-local';

// Constants set for running the server
const app = express();
const compiler = webpack(config);

// Constants set by myself for convenience
const HTTPPORT = 8080;
const HTTPSPORT = 8443;

// Enable HTTPS for cert
var certificate = fs.readFileSync('/etc/letsencrypt/live/vestr.frankpoon.com/fullchain.pem', 'utf8');
var privateKey = fs.readFileSync('/etc/letsencrypt/live/vestr.frankpoon.com/privkey.pem', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};

// MySQL config
var connection = mysql.createConnection(
    JSON.parse(fs.readFileSync('/secretstuff/vestr/mysql-config.json', 'utf-8'))
);

// Bcrypt config
const saltRounds = 6;

// Helps processes POST requests
app.use(bodyParser.urlencoded( {extended: true} ));

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

passport.user(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
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
    connection.connect();
    connection.query(
        'SELECT * FROM Users WHERE Email = ?',
        [req.body.email],
        (error, results, fields) => {
            if (error) console.log(error);
            console.log(results);
            console.log('field below');
            console.log(fields);
        }
    )
    connection.end();
});

app.post('/register', (req, res) => {
    res.send('/register POST request');

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        connection.connect();
        connection.query(
            'INSERT INTO Users (Name, Email, PasswordHash) VALUES (?, ?, ?)',
            [req.body.name, req.body.email, hash],
            (error, results, fields) => {
                if (error) console.log(error);
            }
        );
        connection.end();
    });
});

// starts server in both HTTP and HTTPS (may remove HTTP later)
// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials , app);

/*
httpServer.listen(HTTPPORT, () => {
    console.log('HTTP server started at ' + HTTPPORT);
});
*/

httpsServer.listen(HTTPSPORT, () => {
    console.log('HTTPS server started at ' + HTTPSPORT);
});
