const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const models = require('../../models');

router.get('/shops', (req, res) => {
  models.Item.findAll({
    attributes: ['shop'],
    group: ['shop']
  })
    .then(shops => {
      var plain = shops.map(i => i.shop);
      res.json(plain);
    });
});

router.get('/:shop', (req, res) => {
  var shop = req.params['shop'];

  models.Item.findAll({
    where: {
      dateIn: {
        [Op.lte]: new Date() 
      },
      dateOut: {
        [Op.gte]: new Date()
      },
      shop: shop
    }
  })
    .then(items => {
      res.json(items); 
    });
});

router.post('/', (req, res) => {
  var where = {
    name: req.body.name,
    category: req.body.category,
    oldPrice: req.body.oldPrice,
    newPrice: req.body.newPrice,
    dateIn: req.body.dateIn,
    dateOut: req.body.dateOut,
    condition: req.body.condition,
    // image: req.body.image,
    imageUrl: req.body.imageUrl,
    discount: req.body.discount,
    shop: req.body.discount
  };

  // make a copy of where object
  var defaults = Object.assign({}, where); 
  defaults.crawlDate = req.body.crawlDate;

  models.Item.findOrCreate({
    where: where,
    defaults: defaults 
  })
    .spread((item, created) => {
      // true if a new object was created and false if not
      console.log(item.name + ', created: ' + created);
      res.json(item);
    });
});

router.get('/info', (req, res) => {
  var info = { itemsPerPage: 30 };
  models.Item.count({
    where: {
      dateIn: {
        [Op.lte]: new Date() 
      },
      dateOut: {
        [Op.gte]: new Date()
      }
    }
  })
    .then(count => {
      info.itemCount = count;
      info.numPages = Math.ceil(count / info.itemsPerPage);
      res.json(info);
    });
});

router.get('/categories', (req, res) => {
  models.Item.findAll({
    where: {
      dateIn: {
        [Op.lte]: new Date() 
      },
      dateOut: {
        [Op.gte]: new Date()
      }
    },
    attributes: ['category'],
    group: ['category']
  })
    .then(categories => {
      var plain = categories.map(i => i.category);
      res.json(plain);
    });
});

module.exports = router;
