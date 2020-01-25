var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.post('/', (req, res) => {
    if(req.session.loggedIn){
        res.sendStatus(200);
    }
    else{
        res.status(401).send('Unauthorized, wrong session.');
    }
});

module.exports = router;
