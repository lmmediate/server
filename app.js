const express = require('express');
const path = require('path');
const models = require(path.join(__dirname, 'models'));
const sales = require(path.join(__dirname, 'routes', 'api', 'sales'));
const bodyParser = require('body-parser');
const auth = require('./routes/auth');

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use('/api', sales);
app.use('/api', auth);

app.listen(port, function() {
  console.log('Server started on port ' + port);
});
