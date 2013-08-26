var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var url  = require('url');
var lessMiddleware = require('less-middleware');
var pubDir = path.join(__dirname, 'public');

var app = express();

app.set('view engine', 'ejs');

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(lessMiddleware({
        // should be the URI to your css directory from the location bar in your browser
        src: pubDir, // or '../less' if the less directory is outside of /public
        compress: true,
        debug: true
    }));

    app.use(express.static(pubDir));
});

console.log(__dirname + '/public');

mongoose.connect('mongodb://localhost/ntuj');

var page = require('./models/page.js');
var news = require('./models/news.js');

// for initial
app.get('/init', page.initialPage);
app.get('/drop', page.dropPage);
app.get('/news/drop', news.drop);

// for index
app.get('/', page.loadPageTitle, page.getIndex);

// for normal page
app.get('/p/:first/:second', page.loadPageTitle, page.getContent);

// for admin
app.get('/admin', page.loadPageTitle, function(req,res){
	var pages = res.doc;
    var News = require('./models/news.js').newsModel;

    News.find({}, {} ,{sort:{'date':-1}} , function (err, doc) {
        res.render('admin', {content:null,pages:pages,news:doc});
    });
	
});

app.get('/admin/p/:first/:second', page.getContentByAdmin);
app.post('/admin/p/:first/:second', page.edit);
app.post('/admin/p/:first/:second/delete', page.delete);
app.post('/admin/createClass', page.createClass);
app.post('/admin/createPage', page.createPage);

app.get('/news', page.loadPageTitle, news.index);
app.get('/news/:id', news.view);
app.post('/news/:id', news.update);
app.post('/admin/createNews', news.create);
app.post('/admin/deleteNews', news.delete);

var upload = require("./utilities/upload.js");
app.post("/upload", upload);

app.listen(80);
console.log('Listening on port 80');