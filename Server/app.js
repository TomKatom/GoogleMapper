var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var nodeMailer = require('nodemailer');
const config = require('config');



conn = mysql.createConnection(config.get('mysql'));
conn.connect((err) => {
    if(err) {
        console.log('Error connecting.')
        return;
    }
});
transporter = nodeMailer.createTransport(config.get('email'));

var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var { authRouter } = require('./routes/auth');
var markersRouter = require('./routes/markers');
var verifyRouter = require('./routes/verify');

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
app.use('/auth', authRouter);
app.use('/markers', markersRouter);
app.use('/verify', verifyRouter);
module.exports = app;
