const express = require('express');
const path = require('path');
const models = require(path.join(__dirname, 'models'));


const app = express();
const port = 8080;

app.listen(port, function() {
  console.log('Server started on port ' + port);
});
