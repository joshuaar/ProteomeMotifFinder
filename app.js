var express = require('express');
var http = require('http');
var routes = require('./routes');

var cons = require('consolidate');
var swig = require('swig');

var app = express();

app.engine('.html',cons.swig)
app.set('view engine', 'html');
app.use(express.favicon());

// NOTE: Swig requires some extra setup
// // This helps it know where to look for includes and parent templates
 swig.init({
     root: 'views/',
         allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
         });
         app.set('views', 'views/');

app.set('port', process.env.PORT || 8080);
app.use(express.favicon());

app.get('/',routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
