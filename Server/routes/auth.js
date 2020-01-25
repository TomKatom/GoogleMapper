var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var authorized = (req, res, next) => {
    if(req.session.loggedIn){
        next();
    }
    else{
        res.status(401).send('Unauthorized, wrong session.');
    }
};

router.post('/',authorized, (req, res) => {
   res.sendStatus(200);
});

module.exports = {
    router: router,
    authorized: authorized
};

