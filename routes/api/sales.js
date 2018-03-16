const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const models = require('../../models');

router.get('/', (req, res) => {
  models.Shop.findAll()
    .then(shops => {
      res.json(shops);
    });
});

router.get('/:shop', (req, res) => {
  var shopName = req.params['shop'];

  models.Shop.findOne({
    where: {
      alias: shopName
    }
  })
    .then(shop => {
      if(shop) {
        shop.getItems({
          where: {
            dateIn: {
              [Op.lte]: new Date() 
            },
            dateOut: {
              [Op.gte]: new Date()
            }
          } 
        })
          .then(items => {
            res.json(items);
          });
      } else {
        res.status(404).send('No such shop');
      }
    })
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
    shopId: req.body.shopId
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

router.get('/:shop/info', (req, res) => {
  var shopName = req.params['shop'];
  var info = { itemsPerPage: 30 };
  var where = {
    dateIn: {
      [Op.lte]: new Date() 
    },
    dateOut: {
      [Op.gte]: new Date()
    }
  };

  models.Shop.findOne({
    where: {
      alias: shopName
    }
  })
    .then(shop => {
      if(shop) {
        info.shop = shop;
        shop.countItems({where: where})
          .then(count => {
            info.itemCount = count;
            info.numPages = Math.ceil(info.itemCount / info.itemsPerPage);
          });
        shop.getItems({
          where: where, 
          attributes: ['category'],
          group: ['category']
        })
          .then(categories => {
            var plain = categories.map(i => i.category);
            info.categories = plain;
            res.json(info);
          });
      } else {
        res.status(404).send('No such shop');
      }
    });
});

module.exports = router;

