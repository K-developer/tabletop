var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/index', { title: 'Home' });
});

router.post('/save',  function(req, res){
    let data = req.body;
    try{
        xmas_db.collection("list").insert(data);
       }
    catch(err){
        console.log(err);
    }
    res.send("data Stored");
    
});

router.get('/collect', function(req, res) {
    xmas_db.collection("list").find().toArray(function(err, resp){
            res.send(resp);
    });
});


module.exports = router;
