var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var { authorized } = require('./auth.js');
const { check, validationResult, body, sanitizeBody } = require('express-validator');
const {checkExistsMarkerId} = require('./checkExistInDB.js')

router.post('/', authorized, [
    check('name').notEmpty().withMessage("You need to supply a name."),
    check('longitude').isDecimal().withMessage("You need to supply a decimal value."),
    check('latitude').isDecimal().withMessage("You need to supply a decimal value."),
    body('name').trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array() });
  }
  else{
      conn.query(`insert into tblMarkers (name, latitude, longitude, userId) values ("${req.body.name}", ${req.body.latitude}, ${req.body.longitude}, ${req.session.userId})`, (err, rows, fields) => {
          if (err) res.status(500).json({msg: "Error creating marker."});
          else res.json({msg: "Marker created successfully."});
      })
  }
});

router.get('/', authorized, (req, res) => {
    conn.query(`select * from tblMarkers where userId = ${req.session.userId}`, (err, rows, fields) =>{
       if(err) res.status(500).json({msg: "Error fetching markers."});
       else {
           res.json(rows);
       }
    });
});

router.put('/', authorized, [
    check('name').notEmpty().withMessage("You need to supply a name."),
    check('longitude').isDecimal().withMessage("You need to supply a decimal value."),
    check('latitude').isDecimal().withMessage("You need to supply a decimal value."),
    check('markerId').isNumeric().withMessage("You need to supply a markerId."),
    check('markerId').custom((value) => checkExistsMarkerId(value)),
    body('name').trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }
    else{
        conn.query(`update tblMarkers set name = "${req.body.name}", longitude = ${req.body.longitude}, latitude = ${req.body.latitude} where markerId = ${req.body.markerId}`, (err, rows, fields) => {
            if(err) res.status(500).json({msg: "Error updating marker."});
            else res.json({msg: "Marker updated successfully."});
        })
    }
});


module.exports = router;
