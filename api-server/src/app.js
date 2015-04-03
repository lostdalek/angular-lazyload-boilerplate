var express     = require('express');
var serveStatic = require('serve-static');
var path        = require('path');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var cors        = require('cors');
var CustomError = require('./exceptions/custom-error');

var api         = require('./api/routes.js');
var web         = require('./web/routes.js');
var auth        = require('./auth/routes.js');
var app         = module.exports = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined')); //logger
app.use(express.static(__dirname+'/public', {index: ['index.html']}));
app.set('port', 3000);// process.env.PORT || 3000 );

var whitelist = ['*'];
var corsOptionsDelegate = function(req, callback){
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    }else{
        corsOptions = { origin: false }; // disable CORS for this request
    }
    corsOptions.methods = ['OPTIONS', 'GET', 'PUT', 'POST', 'PATCH'];
    callback(null, corsOptions); // callback expects two parameters: error and options
};
app.use(cors(corsOptionsDelegate));
app.use('/auth', auth);
app.use('/api', api);
app.use('/', web);


// This route deals enables HTML5Mode by forwarding missing files to the index.html
//app.get('/*', function(req, res) {
//    res.header('Content-Type', 'text/html');
//    return res.sendFile(__dirname+'/public/index.html');
//});

app.listen(app.get('port'));




