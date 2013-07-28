// model for page
(function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var pageSchema = new Schema({
        order: Number,
        title: String,
        html: String,
        subPages: [
        { order: Number,
            title: String,
            html: String
        }
        ]
    });


    var Page = mongoose.model('Page', pageSchema);

    module.exports = {
        // for guest
        loadPageTitle: function(req, res, next){
            Page.find({},{'_id':0, 'title':1, 'subPages.title':1 , 'subPages.html':1} , function (err, doc) {
                res.doc = doc;
                next();
            });
            console.log("execute middle ware");
        },

        initialPage: function(req, res){
            var pages = [
            {   
                order: 1,
                title: "introduction",
                subPages: [
                {
                    order: 1,
                    title: "history",
                    html: "I am history"
                },
                {
                    order: 2,
                    title: "objectives",
                    html: "I am objectives"
                },
                {
                    order: 3,
                    title: "specialties",
                    html: "I am specialties"
                }
                ]
            },
            {   
                order: 2,
                title: "faculty",
                subPages: [
                {
                    order: 1,
                    title: "full-time-faculty",
                    html: "I am full-time"
                },
                {
                    order: 2,
                    title: "part-time-faculty",
                    html: "I am part-time"
                },
                {
                    order: 3,
                    title: "practical-faculty",
                    html: "I am practical-faculty"
                }
                ]
            },
            ];

            Page.create(pages ,function (err, doc) {
                console.log("Initialize!")
            });
        },

        getIndex: function(req, res) {
            var pages = res.doc;
            res.render('layout', {content:null, pages:pages});
        },

        getContent: function (req, res) {
            var pages = res.doc;
            var query = {
                title: req.params.first, 
                subPages: {$elemMatch:{title:req.params.second}}
            }; 
            Page.findOne(query, {_id:0,subPages:1} , function (err, doc) {
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
                console.log(doc.subPages);
                for (var i = 0 ; i<doc.subPages.length; i++) {
                    if(doc.subPages[i].title == req.params.second) {
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
        }

    };

}());