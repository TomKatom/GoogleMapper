var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const { check, validationResult, body } = require('express-validator');

let checkTokenExists = (token) => {
    return new Promise((resolve, reject) => {
        conn.query(`select * from tblEmails where token = "${token}"`, (err, rows, fields) => {
            if(rows.length === 1){
                resolve(rows[0]);
            }
            else{
                reject("The specified marker doesn't exist.");
            }
        })
    });
}

router.get('/', [
    check('token').notEmpty().withMessage("You need to supply a token."),
    check('token').custom((value) => checkTokenExists(value)).withMessage("Token doesn't exist."),
    body('token').trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }
    else{
        conn.query(`select * from tblEmails where token = "${req.query.token}"`,(err, rows, fields) => {
          if (err)  return res.status(500).json({msg: "Error Verifying Email."});
          else if(rows.length === 1){
              console.log(rows[0].userId);
              conn.query(`update tblUsers set verifiedEmail = 1 where userId = ${rows[0].userId}`,(err, userRows, fields) => {
                  if(err) return res.status(500).json({msg: "Error Verifying Email."});
                  else {
                      conn.query(`delete from tblEmails where emailId = ${rows[0].emailId}`, (err, rows, fields) => {
                          if (err) return res.status(500).json({msg: "Error Verifying Email."});
                      });
                      return res.json({msg: "Email Verified."});
                  }
              });
          }
        });
    }
})

module.exports = router;
