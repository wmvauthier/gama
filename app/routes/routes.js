module.exports = function (application) {

	application.get('/', function (req, res) {
		application.app.controllers.index.index(application, req, res);
	});

	application.get('/ip', function (req, res) {
		application.app.controllers.index.ip(application, req, res);
	});

	application.post('/url', function (req, res) {
		application.app.controllers.index.url(application, req, res);
	});

}