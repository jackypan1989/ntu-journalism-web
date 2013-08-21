(function () {

    fn = function(req, res) {
        var fs = require('fs'),
            tmpPath = req.files.upload.path,
            l = tmpPath.split('/').length,
            fileName = tmpPath.split('/')[l - 1] + "_" + req.files.upload.name,
            name = req.files.upload.name,
            words = name.split('.'),
            type = words[words.length - 1],
            date = (new Date()).valueOf();

        dest = "public/uploads/" + date + '.' + type;

        fs.readFile(req.files.upload.path, function(err, data) {
          if (err) {
            console.log(err);
            return;
          }
          
            fs.writeFile(dest, data, function(err) {
                var html;
                if (err) {
                  console.log(err);
                  console.log("QQQ");
                  return;
                }
                
                html = "";
                html += "<script type='text/javascript'>";
                html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                //html += "    var url     = \"/uploads/" + fileName + "\";";
                html += "    var url     = \"/uploads/" + + date + '.' + type + "\";";
                html += "    var message = \"Uploaded file successfully\";";
                html += "";
                html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";
                
                res.send(html);
            });
        });
    };
      
    module.exports = fn;

}());