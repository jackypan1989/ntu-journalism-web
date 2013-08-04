var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var url  = require('url');

app.set('view engine', 'ejs');

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

mongoose.connect('mongodb://localhost/ntuj');

var page = require('./models/page.js');
var admin = require('./models/admin.js');

// for initial
app.get('/init', page.initialPage);
app.get('/drop', page.dropPage);

// for index
app.get('/', page.loadPageTitle, page.getIndex);
app.get('/p/:first/:second', page.loadPageTitle, page.getContent);

// for admin
app.get('/admin', page.loadPageTitle, function(req,res){
	var pages = res.doc;
	res.render('admin', {content:null,pages:pages});
});

app.get('/admin/p/:first/:second', page.getContentByAdmin);
app.post('/admin/p/:first/:second', page.edit);

app.listen(3000);
console.log('Listening on port 3000');