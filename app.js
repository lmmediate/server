const express = require('express');
const path = require('path');
const models = require(path.join(__dirname, 'models'));
const sales = require(path.join(__dirname, 'routes', 'api', 'sales'));
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const shoplist = require('./routes/api/shoplist');
const jwt = require('express-jwt');

const app = express();
const port = 8080;
const verifyToken = jwt({secret: 'sssecrettt'});

app.use(bodyParser.json());
app.use('/auth', auth);
app.use('/api/sales', sales);
app.use('/api/shoplist', verifyToken, shoplist);
app.use(function (err, req, res, next) {
  res.status(500).send(err.message);
  // if (err.name === 'UnauthorizedError') {
  //   res.status(401).send('invalid token.');
  // }
});

app.listen(port, function() {
  console.log('Server started on port ' + port);
});
