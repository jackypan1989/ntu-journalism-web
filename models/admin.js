// model for admin
(function () {

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var adminSchema = new Schema({
        account: String,
        password: String,
    });

    var pageSchema = require('mongoose').model('Page');
    var Page = mongoose.model('Page', pageSchema);
    var Admin = mongoose.model('Admin', adminSchema);

    module.exports = {

        read: function (req, res) {
            var page = {
                first: req.params.first,
                second: req.params.second
            }; 
            Page.findOne(page ,function (err, page) {
                console.log(page.html);
                res.send(page.html);
            });
        },

        readAll: function (req, res) {
            Page.aggregate([
                {$group: {_id:'$first', second: {$push: '$second'}}},
                {$project: {_id:0 ,first:'$_id', second: 1}}
                ], function(err, tree) {
                    res.render('admin',{ title: tree});
                });
        },

        create: function (req, res) {
            var page = {
                first: req.body.first,
                second: req.body.second,
                html: req.body.html
            }; 
            Page.create(page, function (err, page) {
                console.log(page.html);
            });
        },

        edit: function (req, res) {
            console.log(req.body);
            var query = {
                first: req.body.first,
                second: req.body.second
            }; 

            Page.update(query,{$set: {html : req.body.html}},
                function(err){
                    res.send('update sucess');
                });
        }

    };

}());