/* importar as configurações do servidor */
var app = require('./config/server');

/* parametrizar a porta de escuta */
app.listen(5000, function () {
	console.log('Bem Vindo ao Gama!');
});
