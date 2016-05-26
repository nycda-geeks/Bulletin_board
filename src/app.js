var express = require('express');
var fs = require('fs');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
app.use( bodyParser.json() );      
app.use( bodyParser.urlencoded({    
	extended: true
})); 


var connectionString = 'postgres://' + process.env.POSTGRES_USER + '@localhost/sarithbreedijk';
// var connectionString ='postgres://sarithbreedijk@localhost/sarithbreedijk';
console.log(connectionString);

app.set('views', 'src/views'); // views are templates
app.set('view engine', 'jade');
app.use(express.static('src'));
app.use(express.static('../js'));

//homepage deze is klaar
app.get('/', function(request, response) {
	console.log("I'm on the index page");
	response.render('index')
});

app.get('/submit', function(request, response) {
	console.log("I'm on the index page");
	response.render('submit')
});

//submitpage
app.post('/submit', function(request, response) {
	console.log("I'm on the submit page");
	var titlemessage = request.body.title;
	console.log(titlemessage)
	var bodymessage = request.body.bodytje;
	console.log(bodymessage)
	pg.connect(connectionString, function (err, client, done) {
		client.query('insert into messages (title, body) values ($1, $2)', [titlemessage, bodymessage], function (err) {
		if(err) {
			throw err;	
		}
		console.log("verzonden")
		done();
		pg.end();

response.redirect('wall')
	});
	});
});



app.get('/wall', function (request, response){
	pg.connect(connectionString, function (err, client, done) {
	client.query("SELECT * from messages", function(err, result) { 
		response.render ('wall', {
			messages: result.rows
		})

		
	});
});
});

var server = app.listen(3000, function() {
	console.log('Example app listening on port: ' + server.address().port);
});
;

