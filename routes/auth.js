const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const models = require('../models');
const Promise = require('bluebird');

const secret = require('../secret').secret;

router.post('/login', (req, res) => { 
  models.Account.findOne({
    where: {
      username: req.body.username.toLowerCase(),
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
  // TODO: remove this checks,
  // intead make frontend checks
  // Synchronous code, simply throw errors
  if(!req.body.username || !req.body.password) {
    throw new Error('Empty credentials.');
  } else if(req.body.username.length < 6) {
    throw new Error('Username is too short');
  } else if(req.body.password.length < 6) {
    throw new Error('Password is too short');
  }
  // Asynchronous code, reject promises on error
  models.Account.findOne({
    where: {
      username: req.body.username.toLowerCase(),
    }
  })
    .then(user => {
      if(user) {
        return  Promise.reject(new Error('Account already exists.'));
      } else {
        return models.Account.create({
          username: req.body.username.toLowerCase(),
          password: req.body.password
        })
      }
    })
    .then(() => res.sendStatus(200))
    .catch(next);
});

module.exports = router;

