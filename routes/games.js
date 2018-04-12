var express = require('express');
var router = express.Router();

/* GET sheets listing. */
router.get('/', function(req, res, next) {
    res.render('games/index', { title: 'Home' });
});

router.get('/roller', function(req, res, next) {
  res.render('games/roller', { title: 'Dice Roller' });
});

router.get('/monstrous_manual', function(req, res, next) {
  res.render('games/combat', { title: 'Monstrous Manual' });
});

router.post('/bestiary', function(req, res, next) {
    let data = req.body;
    db.collection("monsters").find({}, {fields:{"_id":0, guid: 0, fid: 0}}).sort({name:1}).toArray(function(err, resp){
            res.send(resp);
    });
});

module.exports = router;