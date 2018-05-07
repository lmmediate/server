const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const models = require('../models');
const Promise = require('bluebird');
const CryptoJS = require('crypto-js');

const secret = require('../secret').secret;

router.post('/login', (req, res) => { 
  models.Account.findOne({
    where: {
      username: req.body.username,
      // cast to hex string
      password: CryptoJS.SHA256(req.body.password) + "" 
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
      username: req.body.username,
    }
  })
    .then(user => {
      if(user) {
        return  Promise.reject(new Error('Account already exists.'));
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
