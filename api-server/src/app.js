var express     = require('express');
var serveStatic = require('serve-static');
var path        = require('path');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var cors        = require('cors');
var CustomError = require('./exceptions/custom-error');
var teamEntity   = require('./entities/team');
var playerEntity = require('./entities/player');
var app         = module.exports = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
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


app
    .get('/api/player',  function (req, res) {
        // query string: req.query
        res.send({
                "_embedded" : playerEntity().list(),
                "meta" : {
                    "page" : 1,
                    "pages" : 1,
                    "total" : 1,
                    "per_page" : 10
                }
            }
        );
    })
    .get('/api/player/:id',  function (req, res) {
        res.send(playerEntity().get(req.params.id));
    })
    .get('/api/team',  function (req, res) {
        // query string: req.query
        res.send({
                "_embedded" : teamEntity().list(),
                "meta" : {
                    "page" : 1,
                    "pages" : 1,
                    "total" : 1,
                    "per_page" : 10
                }
            }
        );
    })
    .get('/api/team/:id',  function (req, res) {
        res.send(teamEntity().get(req.params.id));
    })
    .post('/api/team',  function (req, res) {
        res.send(201, null);
    })
    .put('/api/team',  function (req, res) {
        res.send(400, null);
    });


// This route deals enables HTML5Mode by forwarding missing files to the index.html
app.get('/*', function(req, res) {
    res.header('Content-Type', 'text/html');
    return res.sendFile(__dirname+'/public/index.html');
});

app.listen(app.get('port'));




