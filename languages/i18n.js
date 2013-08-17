// model for page
(function () {
	
	var fs = require('fs');
    var filename = './languages/zh-tw.json';

	module.exports = {
		readText: function() {

		},
		
		createText: function(key, value) {
			var myData = {
                name:'test',
                version:'2.0'
			};

            var map = JSON.parse(fs.readFileSync(filename, 'utf8'));
            console.log(map);

			fs.writeFile(filename, JSON.stringify(myData) , 'utf8' , function(err) {
			    if(err) {
			      console.log(err);
			    } else {
			      console.log("JSON saved!");
			    }
			}); 
		}
	};

}());
