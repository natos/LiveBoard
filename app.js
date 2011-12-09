var fs = require('fs'),
	util   = require('util'),
	express = require('express'),
	io = require('socket.io'),
	port = process.argv[2] || 8080;

/**
* app & basic data
*/
var app = express.createServer(),
	data = { 
		title: 'LiveBoard', 
		urls: [],
		results: []
	 };

/**
* app configuration.
*/
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('production', function(){
	app.use(express.errorHandler()); 
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});


/**
* Routing
*/
app.get('/', function(req, res, next){
	data.ip = req.connection.remoteAddress;
	res.render('index', data );	
});

/**
* app start
*/
app.listen(port);

/**
* Socket.IO.JS Magic
*/
var io = io.listen(app);

io.sockets.on('connection', function (socket) {

	/**
	* Overview socket listener
	*/
	socket.on('connected', function(_id) {
		socket.broadcast.emit('create pointer', { _id: _id });
	});
	
	socket.on('moving', function(_id, data) {
		socket.broadcast.emit('user moving', { _id: _id, data: data });
	});

	socket.on('clicking', function(_id, data, event, itemId) {
		socket.broadcast.emit('clicked', { _id: _id, data: data, event: event, itemId: itemId });
	});



	socket.on('new-card-created', function(_click, _id) {
		socket.broadcast.emit('new-card-created', _click, _id);
	});

	socket.on('remove-card', function(_id) {
		socket.broadcast.emit('remove-card', _id);
	});

	socket.on('card-start-draggin', function(_id, _click){
		socket.broadcast.emit('card-start-draggin', _id, _click);
	});

	socket.on('card-draggin', function(_id, points) {
		socket.broadcast.emit('card-draggin', _id, points);
	});

	socket.on('card-stop-draggin', function(_id, _click){
		socket.broadcast.emit('card-stop-draggin', _id);
	});


/**
* End Socket
*/
});



/**
* log
*/
console.log("Phantomland listening on port %d", app.address().port);