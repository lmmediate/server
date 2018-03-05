const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const models = require('../models');

const secret = 'sssecrettt';

router.post('/login', (req, res) => { 
  models.Account.findOne({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  })
    .then(account => {
      if(account) {
        jwt.sign({
          id: account.id,
          username: account.username
        }, secret, (err, token) => {
          res.send(token);
        });
      } else {
        res.status(401).send('Wrong username/password.');
      }
    });
});

module.exports = router;
