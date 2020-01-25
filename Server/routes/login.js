var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const {checkExistsEmail , checkExistsUsername, checkExistsPhoneNumber} = require('./checkExistInDB.js');
const { check, validationResult, body } = require('express-validator');

router.post('/', [
    check('phoneNumber').notEmpty().withMessage('You need to supply a phone number'),
    check('password').notEmpty().withMessage('You need to supply a password'),
    body('phoneNumber').trim().escape(),
    body('password').trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    var sqlQuery = `select * from tblUsers where phoneNumber = "${req.body.phoneNumber}"`;
    conn.query(sqlQuery, (err, rows, fields) =>{
        if(rows.length === 1){
            if(bcrypt.compareSync(req.body.password, rows[0].password)){
                req.session.loggedIn = true;
                req.session.phoneNumber = rows[0].phoneNumber;
                res.json({msg: 'Logged in.'});
            }
            else{
                res.json({errors: [{msg: 'Phone number or password do not match.'}]})
            }
        }
        else{
            res.json({errors: [{msg: 'Phone number or password do not match.'}]})
        }
    });
});


module.exports = router;
