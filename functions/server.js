import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

import webpack from 'webpack';
import config from '../webpack.config';
import session from 'express-session';

import bodyParser from 'body-parser';
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
var mysqlConfig = JSON.parse(fs.readFileSync('/secretstuff/vestr/mysql-config.json', 'utf-8'));

// Bcrypt config and authentication
const saltRounds = 6;
var LocalStrategy = passportLocal.Strategy;

// Helps processes POST requests
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(session(JSON.parse(fs.readFileSync('/secretstuff/vestr/session-config.json', 'utf-8'))));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    (username, password, done) => {
        var connection = mysql.createConnection(mysqlConfig);
        connection.query(
            'SELECT * FROM Users WHERE Email = ?',
            [username],
            (error, results, fields) => {
                if (error) {
                    connection.end();
                    return done(error);
                }

                var user = results[0];
                if (user === undefined) {
                    console.log('could not find user');
                    connection.end();
                    return done(null, false);
                }

                bcrypt.compare(password, user.PasswordHash, (error, res) => {
                    if (res) {
                        console.log('login successful');
                        passport.serializeUser( (user, done) => {
                            done(null, user.Email);
                        });
                        passport.deserializeUser( (email, done) => {
                            connection.query(
                                'SELECT * FROM Users WHERE Email = ?',
                                [email],
                                (errors, results, fields) => {
                                    done(errors, results[0]);
                                }
                            );
                            connection.end();
                        });
                    } else {
                        console.log('wrong password');
                        connection.end();
                        return done(null, res);
                    }
                });
            }
        )
    }
));

// Handles loading GET
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/account.html'))
});

app.get('logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log(err);
        req.logout();
        res.redirect('/');
    });
});

// Handles loading POST
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/account' }, (req, res) => {
        res.redirect('/');
    })
);

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        var connection = mysql.createConnection(mysqlConfig);
        connection.query(
            'INSERT INTO Users (Name, Email, PasswordHash) VALUES (?, ?, ?)',
            [req.body.name, req.body.email, hash],
            (error, results, fields) => {
                if (error) console.log(error);
                connection.query(
                    'SELECT * FROM Users WHERE Email = ?',
                    [req.body.email],
                    (errors, results, fields) => {
                        var user = results[0];
                        req.login(user, (err) => {
                            if (err) console.log(err);
                            return res.redirect('/');
                        });
                    }
                );
            }
        );
    });
});



// starts server in HTTPS only - future: create HTTP only test environment
var httpsServer = https.createServer(credentials , app);

httpsServer.listen(HTTPSPORT, () => {
    console.log('HTTPS server started at ' + HTTPSPORT);
});
