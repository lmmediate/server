const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const models = require('../../models');


// var check = function(req, res, next) {
//   console.log(req.headers['authorization']);
//   next();
// }

router.get('/', (req, res) => {
  console.log('-------' + JSON.stringify( req.user));
  res.status(200).send('OK');
});

module.exports = router;
