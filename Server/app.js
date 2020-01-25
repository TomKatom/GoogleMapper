var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser');


conn = mysql.createConnection({
    host: 'localhost',
    user: 'mapperAcc',
    password: 'mapper12345',
    database: 'googlemapperdb'
});
conn.connect((err) => {
    if(err) {
        console.log('Error connecting.')
        return;
    }
});

var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(require('express-session')({ secret: 'very secret secret', resave: true, saveUninitialized: true }));


app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
module.exports = app;
