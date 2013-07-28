var express = require('express');
var server = express();
var path = require('path');
var mongoose = require('mongoose');
var url  = require('url');

server.set('view engine', 'ejs');

server.configure(function(){
	server.use(express.bodyParser());
	server.use(express.methodOverride());
	server.use(server.router);
	server.use(express.static(path.join(__dirname, 'public')));
});

mongoose.connect('mongodb://localhost/ntuj');

var page = require('./models/page.js');
var admin = require('./models/admin.js');

// for index
//server.get('/', lib.initialPage);
server.get('/', page.loadPageTitle, page.getIndex);
server.get('/p/:first/:second', page.loadPageTitle, page.getContent);

// for admin
server.get('/admin', page.loadPageTitle, function(req,res){
	var pages = res.doc;
	res.render('admin', {content:null,pages:pages});
});

server.get('/admin/p/:first/:second', page.getContentByAdmin);
server.post('/admin/p/:first/:second', page.edit);

server.listen(3000);
console.log('Listening on port 3000');