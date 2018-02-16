var express = require('express');
var router = express.Router();

/* GET sheets listing. */
router.get('/', function(req, res, next) {
    res.render('sheets/index', { title: 'Home' });
});

router.get('/gurps', function(req, res, next) {
  res.render('sheets/gurps', { title: 'Gurps sheets' });
});

router.get('/dnd', function(req, res, next) {
  res.render('sheets/dnd', { title: 'D&D sheets' });
});

router.get('/shadowrun', function(req, res, next) {
  res.render('sheets/shadowrun', { title: 'Shadowrun sheets' });
});
module.exports = router;