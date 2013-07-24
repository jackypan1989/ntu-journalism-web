var express = require('express');
var server = express();
var routes = require('./routes');
var path = require('path');


server.set('view engine', 'ejs');
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', routes.index);


server.get('/intro', function(req,res) {
	res.send('介紹');
});

server.get('/member', function(req,res) {
	res.send('人員');
});

server.get('/course', function(req,res) {
	res.send('課程');
});

server.get('/publication', function(req,res) {
	res.send('出版品');
});

server.get('/journalist', function(req,res) {
	res.send('記者');
});


server.listen(3000);
console.log('Listening on port 3000');