var express = require('express');
var mongoose = require('mongoose');
var app = express();

var mongodbUrl = 
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/routes';

//TODO refactor mongoose part to a seperate module
//TODO add password / authentication checking for mongo db
//Connect to default port 27017
mongoose.connect(mongodbUrl);
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
	console.log('connect to mongo successfully');
});

var routeSchema = mongoose.Schema({
	name: String,
	category: String,
	author: String,
	dateUpdated: String,
	mapUrl: String,
	description: String,
	imgUrl: String,
	guides: [{imgUrl: String, explaination: String}],
	meta:{
		votes: Number,
		favs: Number
	}
});

var Route = mongoose.model('Route', routeSchema);

app.use(express.json());

app.get('/', function(req,res){
	res.send("DragonBack is available");
})

app.get('/routes', function(req,res){
	Route.find(function(err, routes){
		if(err){
			res.send("Fail to load routes with error: "+ err);
		}
		res.send(routes);
	});
});

app.get('/routes/:searchKey/:searchValue', function(req,res){
	var query = Route.find();

	query.where(req.params.searchKey).equals(req.params.searchValue);

	query.exec(function(err, route){
		if(err){
			console.error("Fail to load route with error: " + err);
			res.send("Error: " + err);
		}
		res.send(route);
	});
});

app.post('/routes', function(req,res){
	//TODO error handling when request is not in json format
	var newRoute = new Route({
		name: req.body.name,
		category: req.body.category,
		author: req.body.author,
		dateUpdated: new Date(),
		mapUrl: req.body.mapUrl,
		imgUrl: req.body.imgUrl,
		descrption: req.body.description,
		guides: req.body.guides,
	});
	newRoute.save(function(err, newRoute){
		if(err){
			console.error(err);
			res.send("ERROR: "+ err);
		}
		console.log('successfully saved route:' + newRoute);
		res.send(newRoute.toString());
	});
});

app.put('/routes/:id', function(req,res){

	var query = Route.find();

	query.where('_id').equals(req.params.id);

	query.exec(function(err, route){
		if(err){
			console.error("Fail to load route with error: " + err);
			return res.send("Error: " + err);
		}
	});

	query.update(req.body, function(err, numberAffected){
		if(err){
			res.send("ERROR: " + err);
		}
		res.send("Updated " + numberAffected + " record(s)" );
	});
	
});

app.delete('/routes/:id', function(req,res){
	//TODO Need some checking
		var query = Route.find();

	query.where('_id').equals(req.params.id);

	query.exec(function(err, route){
		if(err){
			console.error("Fail to load route with error: " + err);
			return res.send("Error: " + err);
		}
	});

	query.remove(function(err){
		if(err){
			console.error("Error out: " + err);
			return res.send("Error out: " + err);
		}
		res.send("successfully removed one record");
	});

});

var port = Number(process.env.PORT || 5000);

app.listen(port, function(){console.log('Listening to port: ' + port)});