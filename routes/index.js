exports.index = function(req,res) {
	res.render('layout', { body: 'The index page!' });
}