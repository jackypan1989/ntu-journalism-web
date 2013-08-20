// model for page
(function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var async = require('async');

    var newsSchema = new Schema({
        _id: Schema.Types.ObjectId,
        type: String,
        date: { type: Date, default: Date.now },
        title: String,
        html: String,
        hit: { type: Number, default: 0 }
    });

    var News = mongoose.model('News', newsSchema);

    module.exports = {
        create: function (req, res) {
            var news = {
                type: req.body.type,
                title: req.body.title,
                html: req.body.newsEditor
            };

            News.create(news, function (err, doc) {
                res.send("create!");
            });
        },

        index: function (req, res) {
            var pages = res.doc;
            News.find(function (err, doc) {
                res.render('news', { pages:pages, newsList:doc});
            });
        },

        view: function (req, res) {
            var id = req.params.id;
            News.findById(id, function (err, doc) {
                res.send(doc);
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
                res.send("update");
            });
        },

        delete: function (req, res) {
            News.remove({}, function (err, doc) {
                res.send("remove");
            });
        }
    };

}());