const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');

const sales = require('./routes/api/sales');
const auth = require('./routes/auth');
const shoplist = require('./routes/api/shoplist');

const app = express();
const port = 80;
const verifyToken = jwt({secret: 'sssecrettt'});

app.use(express.static('../web-app'));

app.use(bodyParser.json());
app.use('/auth', auth);
app.use('/api/shops', sales);
app.use('/api/shoplist', verifyToken, shoplist);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid or missing token.');
  } else {
    res.status(500).send(err.message);
  }
});

app.listen(port, function() {
  console.log('Server started on port ' + port);
});
