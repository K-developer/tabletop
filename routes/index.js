var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });

});

router.get('/show', function(req, res, next) {
    res.render('show', { title: 'Show' });    
});

router.get('/roller', function(req, res, next) {
    res.render('roller', { title: 'Roller' });    
});


router.get('/calc', function(req, res, next) {
    res.render('calc', { title: 'PointBuy Calculator' });    
});

router.get('/shoal', function(req, res, next) {
    res.render('shoal', { title: 'Shoal' });    
});

router.get('/perma', function(req, res, next) {
    res.render('perma', { title: 'Perma' });    
});

router.post('/permaSheet',  function(req, res){
    let data = req.body;
    console.log(data);
    db.collection("gurps").findOne({'player_id': data.id, 'n': data.name}, function(err, resp){
            console.log(resp);
            res.send(resp);
    });
    
});


   
router.post('/save',  function(req, res){
    let data = req.body;
    try{
        db.collection("gurps").insert(data);
       }
    catch(err){
        console.log(err);
    }
    res.send("data Stored");
    
});


router.post('/collect',  function(req, res){
    let data = req.body;
    console.log(data);
    db.collection("gurps").find({'player_id': data.id}).toArray(function(err, resp){
            console.log(resp);
            res.send(resp);
    });
});

router.post('/register',  function(req, res){
    let data = req.body;
    console.log(data);
    try{
        db.collection("accounts").insert(data);
       }
    catch(err){
        console.log(err);
    }
    let response_data = JSON.stringify({'name': data.name, 'type': data.player,  "id": data._id, 'expires': 1*60*24*7});
    res.send(response_data);
    
});

router.post('/login',  function(req, res){
    let data = req.body;
    console.log(data)
    try{
        db.collection("accounts").findOne({$or: [{name : data.name, password : data.password}, {email:data.name, password:data.password} ] }, function(err, document){
            if(document){
                res.send(JSON.stringify({'name': document.name, 'type': document.player, "id": document._id, 'expires': 1*60*24*7}));
            }else{
                res.send(JSON.stringify({'errors': 'No Results'}))
            }
            
        });
       }
    catch(err){
        console.log(err);
    }
    
    
});
module.exports = router;
