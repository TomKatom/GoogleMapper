var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    conn.query('select * from tblUsers where username = "TomKatom"', (err, rows, fields) => {
        res.send(rows[0].username);
    });
});
module.exports = router;
