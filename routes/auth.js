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

router.post('/register', (req, res, next) => {
  models.Account.findOne({
    where: {
      username: req.body.username,
    }
  })
    .then(user => {
      if(user) {
        res.status(500).send('Account already exists.');
        return;
      } else {
        return models.Account.create({
          username: req.body.username,
          password: req.body.password
        })
      }
    })
    .then(() => res.sendStatus(200))
    .catch(next);
});

module.exports = router;
