var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { check, validationResult, body } = require('express-validator');
var bcrypt = require('bcryptjs');
const {checkExistsEmail , checkExistsUsername, checkExistsPhoneNumber} = require('./checkExistInDB.js');
const nanoid = require('nanoid');


router.post('/', [
    /* Input Validation */
    check('username').isLength({min: 3, max: 45}).withMessage('Name length must be between 3 to 45.'),
    check('email').isEmail().withMessage('Invalid email.'),
    check('phoneNumber').isMobilePhone().withMessage('Invalid phone number.'),
    check('password').isLength({min: 8}).withMessage('Password should be at least 8 chars.'),
    // check('rPassword').matches().withMessage('Passwords do not match'),
    /* Sanitizing Input */
    body('username').trim().escape(),
    body('phoneNumber').trim().escape(),
    body('email').normalizeEmail(),
    check('username').custom((value) => {
        return checkExistsUsername(value);

    }).withMessage('Username already exists.'),
    check('email').custom((value) => {
        return checkExistsEmail(value);

    }).withMessage('Email is already used.'),
    check('phoneNumber').custom((value) => {
        return checkExistsPhoneNumber(value);

    }).withMessage('Phone Number is already used.')
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }
    else{
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        var sqlQuery = `insert into tblUsers (username, password, phoneNumber, email) values ("${req.body.username}", "${hash}", "${req.body.phoneNumber}", "${req.body.email}")`;
        conn.query(sqlQuery, (err, rows, fields) => {
            if(err) {
                return res.status(500).json({result: 'Error Creating Account'});
            }
            else{
                conn.query(`select * from tblUsers where username = "${req.body.username}"`, (err, rows, fields) => {
                    if (rows.length === 1) {
                        var token = nanoid(48);
                        conn.query(`insert into tblEmails (userId, emailMode, token) values (${rows[0].userId}, '{ "mode" : "verify" }', "${token}")`, (err, rows, fields) => {
                            if (err) return res.status(500).json({result: 'Error inserting Email to db.'});
                            else{
                                let mailOptions = {
                                    to: req.body.email,
                                    subject: "Google Mapper - Verification Email",
                                    html: `<a href="localhost:3000/verify?token=${token}"> Verify Email </a>`
                                };
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return res.status(500).json({msg: "Error Sending Email.", err: error});
                                    }
                                    else{
                                        console.log('Message %s sent: %s', info.messageId, info.response);
                                        return res.json({msg: 'Account Created Successfully.'});
                                    }
                                });
                            }
                        });
                    }
                    else{
                        return res.status(500).json({result: 'Error Creating Account'});
                    }
                });
            }
        });
    }
});

module.exports = router;
