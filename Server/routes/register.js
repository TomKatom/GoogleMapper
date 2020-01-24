var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { check, validationResult, body } = require('express-validator');
var bcrypt = require('bcryptjs');


let checkExistsEmail = (email) => {
    return new Promise((resolve, reject) => {
        conn.query('select * from tblUsers where email = "' + email + '"', (err, rows, fields) => {
            if(rows.length === 1){
                reject('Email is already used.')
            }
            else{
                resolve(rows[0]);
            }
        })
    })
};
let checkExistsUsername = (username) => {
    return new Promise((resolve, reject) => {
        conn.query('select * from tblUsers where username = "' + username + '"', (err, rows, fields) => {
            if(rows.length === 1){
                reject('Username already exists.')
            }
            else{
                resolve(rows[0]);
            }
        })
    })
};

let checkExistsPhoneNumber = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        conn.query('select * from tblUsers where phoneNumber = "' + phoneNumber + '"', (err, rows, fields) => {
            if(rows.length === 1){
                reject('Phone number is already used.')
            }
            else{
                resolve(rows[0]);
            }
        })
    })
};


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
        console.log(sqlQuery);
        conn.query(sqlQuery, (err, rows, fields) => {
            if(err) console.log('Error inserting new user.');
            else{
                res.json({result: 'Account Created Successfully.'});
            }
        });
    }
});

module.exports = router;
