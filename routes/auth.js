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
        jwt.sign({user: account.username}, secret, (err, token) => {
          res.send(token);
        });
      } else {
        res.sendStatus(403);
      }
    });
});

module.exports = router;
