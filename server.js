/*
* Dependencies:
* npm install express connect body-parser method-override path vhost express.io
*
* or 'npm install' using the package.json
*/

var express         = require('express');
var bodyParser      = require('body-parser'); // Middleware that decodes JSON and POST parameters
var methodOverride  = require('method-override'); // Middleware that simulates DELETE (delete specified file on origin server) and PUT (Store file on origin server).
var router          = express.Router();
var vhost           = require('vhost');
var app             = require('express.io')();
var port            = parseInt(process.env.PORT, 10) || 4000;

// Simple timestamp function. Invoke with timestamp();
htimestamp = function() {
    var date = new Date();
    result = '[' + date.getFullYear() + '/' + date.getMonth() + '/' +
        date.getDate() + '/' + date.getHours() + ':' +
        date.getMinutes() + ':' + date.getSeconds() + ']';
    return result;
}

app.http().io(); // Initialize the server.

/*
 * Configure the server.
 */

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// Parse application/json
app.use(bodyParser.json());

// Do not tell header that server is powered by Node.js
app.disable('x-powered-by');

// Simulate HTTP DELETE and PUT.
// Only uncomment is you want to use PUT and DELETE.
// app.use(methodOverride());

app.listen(port); // Listen through the specified port.
//app.enable('trust proxy'); // Enables reverse proxy support Default: false

/*
 * Setup the website.
 */

// This app is routed to a variable calling express.io. You can host multiple websites by following the following as a template.
var home = require('express.io')();

// This has to be relative to where your html files are located, etc. In this case it is in App.
home.use('/js', express.static(__dirname + '/app/js'));
home.use('/css', express.static(__dirname + '/app/css'));;
home.use('/img', express.static(__dirname + '/app/img'));

home.set('jsonp callback', true);

var hostname = 'localhost'; // Set the hostname for your website.
app.use(vhost(hostname, home)); // Vhost allows you to host multiple websites on the same server.

home.get('/', function(req, res) {
    //req.header('Access-Control-Allow-Origin', '*');
    res.sendfile(__dirname + '/app/index.html');

    req.io.route('home');
})

/* Outputs the users' ips visiting your website. */
app.io.route('home', function (req) {
    console.log(htimestamp() + ' ' + req.ip);
});

/* Debug */
console.log(__dirname);
console.log(__dirname + '/app/');
console.log('Listening on port: ' + port);
console.log('hostname: ' + hostname);
console.log('go to ' + hostname + ':' + port);
