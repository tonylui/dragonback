var express = require('express');
var trails = require('./lib/trail.js');
var app = express();

app.use(express.json());

app.all('*', function(req, res, next){
  // if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

app.get('/', function(req,res){
	res.send("DragonBack is available");
})

app.get('/trails', trails.getAllTrails);

app.get('/trails/:searchKey/:searchValue', trails.searchTrail);

app.post('/trails', trails.addTrail);

app.put('/trails/:id', trails.updateTrail);

app.delete('/trails/:id', trails.deleteTrail);

var port = Number(process.env.PORT || 5000);

app.listen(port, function(){console.log('Listening to port: ' + port)});