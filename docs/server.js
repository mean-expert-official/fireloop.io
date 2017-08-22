var express = require('express'); 
var path = require('path');
var app = express();
var directory = path.join(__dirname, 'dist');
app.use('/', express.static(directory))
// All other routes should redirect to the index.html
app.route('/*')
  .get(function(req, res) {
    res.sendFile(path.resolve(directory + '/index.html'));
  });
app.listen(process.env.PORT || 3000);
