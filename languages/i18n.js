// model for page
(function () {
	
	var fs = require('fs');
    var async = require('async');
    var filename = './languages/zh-tw.json';

	module.exports = {
		select: function(lan){
			filename = './languages/'+lan+'.json';
		},

		readText: function(key) {
            var map = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
            return map[key];
        },
		
		createText: function(key, value) {
            var map = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
            map[key] = value;
            fs.writeFileSync(filename, JSON.stringify(map,null,4) , {encoding: 'utf8'});
		}
	};
}());
