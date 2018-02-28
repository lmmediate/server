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

router.post('/sales', (req, res) => {
  var sample = {
    name: req.body.name,
    category: req.body.category,
    oldPrice: req.body.oldPrice,
    newPrice: req.body.newPrice,
    dateIn: req.body.dateIn,
    dateOut: req.body.dateOut,
    condition: req.body.condition,
    image: req.body.image,
    imageUrl: req.body.imageUrl,
    discount: req.body.discount
  };

  models.Item.findOrCreate({
    where: sample,
    defaults: sample 
  })
    .spread((item, created) => {
      // true if a new object was created and false if not
      console.log(created);
      res.json(item);
    });
});

module.exports = router;
