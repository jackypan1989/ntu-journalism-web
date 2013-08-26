// model for page
(function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var async = require('async');

    var newsSchema = new Schema({
        _id: Schema.Types.ObjectId,
        type: {type: String, enum: ['news', 'activity', 'enroll']},
        date: { type: Date, default: Date.now },
        title: String,
        html: String,
        hit: { type: Number, default: 0 }
    });

    var News = mongoose.model('News', newsSchema);
    
    module.exports = {
        newsModel: News,

        create: function (req, res) {
            var news = {
                type: req.body.type,
                title: req.body.title,
                html: req.body.newsEditor
            };

            News.create(news, function (err, doc) {
                res.redirect('/admin');
            });
        },

        index: function (req, res) {
            var pages = res.doc;
            var type = req.query.type;
            var query = {'type': type};
            News.find(query, {} ,{sort:{'date':-1}} , function (err, doc) {
                res.render('news', { type: type, pages:pages, newsList:doc});
            });
        },

        view: function (req, res) {
            var id = req.params.id;
            News.findById(id, function (err, doc) {
                News.findByIdAndUpdate(id,{$inc:{'hit':1}}, function(err){
                    res.send(doc);
                });
            });
        },

        update: function (req, res) {
            var id = req.params.id;
            var update = {
                type: req.body.type,
                title: req.body.title,
                html: req.body.newsEditor
            }

            News.findByIdAndUpdate(id, update, function (err, doc) {
                res.redirect('/admin');
            });
        },

        drop: function (req, res) {
            News.remove({}, function (err, doc) {
                res.redirect('/admin');
            });
        },

        delete: function (req, res) {
            var id = req.body.radios;
            News.findByIdAndRemove(id, function (err, doc) {
                res.redirect('/admin');
            });
        }
    };

}());