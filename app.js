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
    app.use( express.cookieParser());
    app.use(express.session({secret: 'jackypan1989'}));
});
    app.use(app.router);
    app.use(lessMiddleware({
        // should be the URI to your css directory from the location bar in your browser
        src: pubDir, // or '../less' if the less directory is outside of /public
        compress: true,
        debug: true
    }));

    app.use(express.static(pubDir));
    app.use("/languages", express.static(__dirname + "/languages"));

console.log(__dirname + '/public');

// mongoose.connect('mongodb://140.112.153.67/ntuj');

var page = require('./models/page.js');
var news = require('./models/news.js');

// check lan
app.all('*', function(req, res, next){
    if (!req.session.locale) {
        req.session.locale = 'zh-tw';
        mongoose.disconnect();
        mongoose.connect('mongodb://140.112.153.67/ntuj');
        console.log(req.session.locale);
        app.locals.locale = req.session.locale;
        next();
    } else {
        next();
    }
});

// for initial
app.get('/init', page.initialPage);
app.get('/drop', page.dropPage);
app.get('/news/drop', news.drop);

// for index
app.get('/', page.loadPageTitle, page.getIndex);

// for normal page
app.get('/p/:first/:second', page.loadPageTitle, page.getContent);

// for login
app.get('/login', function(req,res) {
    res.render('login');
});

app.post('/login', function(req,res) {
    console.log("asd");
    if (req.body.account === 'admin' && req.body.password === 'jour5566'){
        req.session.user = 'admin';
        res.redirect('/admin');
    } else {
       res.redirect('/'); 
    }
});

app.post('/logout', function(req,res) {
    delete req.session.user;
    res.redirect('/');
});

// for admin
app.get('/admin',page.auth, page.loadPageTitle, function(req,res){
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

app.post('/changeLocale', 
    function(req, res){
        var newLocale = req.body.locale;
        if (req.session.locale === newLocale) {
            res.redirect('/');
        } else {
            req.session.locale = newLocale;
            page.i18n.select(newLocale);
            app.locals.locale = newLocale;
            
            mongoose.disconnect();
            if (newLocale === 'zh-tw') {
                mongoose.connect('mongodb://140.112.153.67/ntuj');
                res.redirect('/');
            } else if (newLocale === 'en') {
                mongoose.connect('mongodb://140.112.153.67/ntuj-en');
                res.redirect('/');
            }
        }
    });



var upload = require("./utilities/upload.js");
app.post("/upload", upload);

app.listen(3000);
console.log('Listening on port 3000');
