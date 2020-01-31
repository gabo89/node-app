var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

let reporter = function (type, ...rest)
{
	// remote reporter logic goes here
};


/* handle an uncaught exception & exit the process */
process.on('uncaughtException', function (err)
{
	console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
	console.error(err.stack);

	reporter("uncaughtException", (new Date).toUTCString(), err.message, err.stack);

	process.exit(1);
});

/* handle an unhandled promise rejection */
process.on('unhandledRejection', function (reason, promise)
{
	console.error('unhandled rejection:', reason.message || reason);

	reporter("uncaughtException", (new Date).toUTCString(), reason.message || reason);
})


// Configuring the database
const dbConfig = require('./config/db.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true,
	useUnifiedTopology: true 
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var CustomerService = require('./services/service.customer');
var LoginService = require('./services/service.login');
var Emailservice = require('./services/service.email');
var generate_uids = require('./routes/generate_uids');

	app.use('/api/v1/generate_uid', generate_uids);
	app.post('/api/v1/service/login', CustomerService.retrieveone_by_email_password);
	app.post('/api/v1/service/email', CustomerService.retrieveone_by_email);

    app.post('/api/v1/customer/', CustomerService.create);	
    app.get('/api/v1/customer/', CustomerService.retrieveall);
    app.get('/api/v1/customer/:id', CustomerService.retrieveone_byid);
    app.put('/api/v1/customer/:id', CustomerService.updateone);
    app.delete('/api/v1/customer/:id', CustomerService.deleteone);

	
	
	app.post('/api/v1/login', LoginService.create);
	app.get('/api/v1/login/', LoginService.retrieveall);
	app.get('/api/v1/login/:username', LoginService.retrieveone);
    app.put('/api/v1/login/:username', LoginService.updateone);
    app.delete('/api/v1/login/:username', LoginService.deleteone);
	
	
	app.post('/api/v1/email', Emailservice.create);
	app.get('/api/v1/email/', Emailservice.retrieveall);
	app.get('/api/v1/email/:id', Emailservice.retrieveone_byid);

module.exports = app;
