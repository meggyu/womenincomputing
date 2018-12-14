var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;

var db;
var APP_PATH = path.join(__dirname, 'dist');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(APP_PATH));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Accessing Opportunities database
// GETs opportunities from the "opportunities" collection in mLab
app.get('/api/opportunities', function(req, res) {
  db.collection("opportunities").find({}).toArray(function(err, docs) {
    if (err) throw err;
    res.json(docs);
  })
});


// POSTs new opportunities to the "opportunities" collection in mLab
app.post('/api/opportunities', function(req, res) {
    var newOpportunity = {
      id: Date.now(),
      title: req.body.title,
      companyName: req.body.companyName,
      location: req.body.location,
      description: req.body.description,
      link: req.body.link,
      type: req.body.type
    };
    db.collection("opportunities").insertOne(newOpportunity, function(err, result) {
        if (err) throw err;
        db.collection("opportunities").find({}).toArray(function(err, docs) {
            if (err) throw err;
            res.json(docs);
        });
    });
});

app.use('*', express.static(APP_PATH));

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

// This assumes that the MongoDB password has been set as an environment variable.
var mongoURL = 'mongodb://cs336:' +
	       process.env.MONGO_PASSWORD +
           '@ds155073.mlab.com:55073/cs-336';
MongoClient.connect(mongoURL, function(err, dbConnection) {
    if (err) throw err;
    db = dbConnection;
});
