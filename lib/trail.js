var mongoose = require('mongoose');

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

var trailSchema = mongoose.Schema({
	dateUpdated: String,
	publisher: String,
	name: String,
	coverImg: String,
	map: String,
	transportTo: String,
	transportFrom: String,
	description: String,
	difficulty: Number,
	steps:[{
		img: String,
		description: String
	}],
	vote: Number
});

var Trail = mongoose.model('Trail', trailSchema);

exports.addTrail = function(req, res){

	var trail = new Trail(req.body);

	trail.dateUpdated = new Date();
	trail.vote = 0;

	trail.save(function(err, newRoute){
		if(err){
			console.error(err);
			res.send("ERROR: "+ err);
		}
		console.log('successfully saved route:' + newRoute);
		// res.send(newRoute.toString());
		res.send('OK');
	});

};

exports.searchTrail = function(req,res){
	var query = Trail.find();

	query.where(req.params.searchKey).equals(req.params.searchValue);

	query.exec(function(err, trails){
		if(err){
			console.error("Fail to load route with error: " + err);
			res.send("Error: " + err);
		}
		res.send(trails);
	});

};

exports.deleteTrail = function(req,res){

	var query = Trail.find();

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
		res.send("OK");
	});

};

exports.updateTrail = function(req,res){

	var query = Trail.find();

	console.log('i am here!');

	query.where('_id').equals(req.params.id);

	query.exec(function(err, trails){
		if(err){
			console.error("Fail to load route with error: " + err);
			return res.send("Error: " + err);
		}
	});

	console.log('updateTrail: successfully identify trail: '+ req.params.id);

	query.update(req.body, function(err, numberAffected){
		if(err){
			res.send("ERROR: " + err);
		}
		res.send("OK: " + numberAffected + " record(s) affected" );
	});
};

exports.getAllTrails = function(req,res){
	Trail.find(function(err, trails){
		if(err){
			res.send("Fail to load routes with error: "+ err);
		}
		res.send(trails);
	});
};
