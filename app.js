const express = require('express');
const path = require('path');
const models = require(path.join(__dirname, 'models'));
const sales = require(path.join(__dirname, 'routes', 'api', 'sales'));

const app = express();
const port = 8080;

app.use('/api', sales);

app.listen(port, function() {
  console.log('Server started on port ' + port);
});
