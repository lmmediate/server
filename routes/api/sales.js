const express = require('express');
const router = express.Router();
const path = require('path');
const { Op } = require('sequelize')
const models = require(path.join(__dirname, '../..', 'models'));

router.get('/sales', (req, res) => {
  models.Item.findAll({
    where: {
      date_in: {
        [Op.lte]: new Date() 
      },
      date_out: {
        [Op.gte]: new Date()
      }
    }
  })
    .then(items => {
      res.json(items); 
    });
});

module.exports = router;
