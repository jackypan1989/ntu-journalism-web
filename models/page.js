// model for page
(function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;


    var i18n = require('../languages/zh-tw.js');
    var translate = function (language, text) {
        // language array contains all the languages
        console.log(language + ' ' + text + ' ' );
        return i18n[text] || text+'(無翻譯)';
    };


    var pageSchema = new Schema({
        _id: String,
        order: Number,
        title: String,
        html: String,
        subPages: [
        { 
            _id: String,
            order: Number,
            title: String,
            html: String
        }
        ]
    });


    var Page = mongoose.model('Page', pageSchema);

    module.exports = {
        initialPage: function(req, res){
            var pages = [
            {   
                order: 1,
                _id: "introduction",
                title: "introduction",
                subPages: [
                {
                    order: 1,
                    _id: "history",
                    title: "history",
                    html: "I am history"
                },
                {
                    order: 2,
                    _id: "objectives",
                    title: "objectives",
                    html: "I am objectives"
                },
                {
                    order: 3,
                    _id: "specialties",
                    title: "specialties",
                    html: "I am specialties"
                }
                ]
            },
            {   
                order: 2,
                _id: "faculty",
                title: "faculty",
                subPages: [
                {
                    order: 1,
                    _id: "full-time-faculty",
                    title: "full-time-faculty",
                    html: "I am full-time"
                },
                {
                    order: 2,
                    _id: "part-time-faculty",
                    title: "part-time-faculty",
                    html: "I am part-time"
                },
                {
                    order: 3,
                    _id: "practical-faculty",
                    title: "practical-faculty",
                    html: "I am practical-faculty"
                }
                ]
            },
            ];


            Page.create(pages ,function (err, doc) {
                console.log("Initialize!");
                res.send("Initialize!");
            });
        },

        dropPage: function(req, res){
            Page.remove({} ,function (err, doc) {
                console.log("Remove!")
                res.send("Remove!");
            });
        },

        // for guest
        loadPageTitle: function(req, res, next){
            var query = {};
            var projection = {
                '_id':1, 
                'title':1, 
                'subPages._id':1,
                'subPages.title':1, 
                'subPages.html':1
            };
            
            Page.find(query, projection, function (err, doc) {
                for(var i = 0; i < doc.length; i++) {
                    doc[i].title = translate(null,doc[i]._id);
                    for (var j = 0; j < doc[i].subPages.length; j++) {
                        doc[i].subPages[j].title = translate(null,doc[i].subPages[j]._id);
                    }
                }

                res.doc = doc;
                next();
            });
            console.log("execute middle ware");
        },

        getIndex: function(req, res) {
            var pages = res.doc;
            res.render('index', {pages:pages, content:null});
        },

        getContent: function (req, res) {
            var pages = res.doc;
            var query = {
                _id: req.params.first, 
                subPages: {$elemMatch:{_id:req.params.second}}
            }; 

            Page.findOne(query, {_id:1,subPages:1} , function (err, doc) {
                console.log(doc.subPages);
                for (var i = 0 ; i<doc.subPages.length; i++) {
                    if(doc.subPages[i].title == req.params.second) {
                        var html = doc.subPages[i].html;
                        console.log(doc.subPages[i].order);
                        res.render('layout',{ pages:pages, content: html });
                    }
                }
            });
        },

        // for admin
        getContentByAdmin: function (req, res) {
            var pages = res.doc;
            var query = {
                title: req.params.first, 
                subPages: {$elemMatch:{title:req.params.second}}
            }; 
            Page.findOne(query, {_id:0,subPages:1} , function (err, doc) {
                console.log(JSON.stringify(doc));
                for (var i = 0 ; i<doc.subPages.length; i++) {
                    if(doc.subPages[i].title === req.params.second) {
                        var html = doc.subPages[i].html;
                        res.send({content: html});
                    }
                }
            });
        },

        edit: function (req, res) {
            console.log(req.body);
            var query = {
                title: req.body.first,
                subPages: {$elemMatch:{title:req.body.second}}
            }; 

            Page.findOneAndUpdate(query,{$set: {'subPages.$.html' : req.body.html }},
                function(err,doc){
                    res.send(doc+'update sucess');
                });
        },

        createClass: function (req, res) {
            console.log(req.body);
            var page = {
                _id: req.body._id,
                title: req.body.title,
                order: 0,
                html: '',
                subPages: [] 
            };

            Page.create(page, function (err, doc) {
                console.log("Create!");
                res.redirect('/admin');
            });

        },

        createPage: function (req, res) {
            console.log(req.body);
            var query = {
                _id: req.body.classList
            };

            var subPage =  { 
                _id: req.body._id,
                order: 0,
                title: req.body.title,
                html: ''
            };

            var update = {
                $push : {'subPages': subPage}
            };

            Page.update(query, update, function (err, doc) {
                console.log("Create!");
                res.redirect('/admin');
            });

        }
    };

}());