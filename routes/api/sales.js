const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const models = require('../../models');
const utils = require('../../utils/utils');

// Pagination
const ITEMS_PER_PAGE = 30;

router.get('/', (req, res) => {
  models.Shop.findAll()
    .then(shops => {
      res.json(shops);
    });
});

router.get('/:shopId/categories', (req, res) => {
  var shopId = req.params['shopId'];
  var where = utils.actualItemsWhere({shopId: shopId});

  models.Item.findAll({
    where: where, 
    attributes: ['category'],
    group: ['category']
  })
    .then(result => {
      var plain = result.map(i => i.category);
      res.json(plain);
    });

});

router.get('/:shopId', (req, res) => {
  var shopId = req.params['shopId'];
  var category = req.query['category'];
  var name = req.query['name'];
  var page = +req.query['page'] || 1;

  var where = utils.actualItemsWhere({shopId: shopId});

  if(category) {
    where.category = category;
  }
  if(name) {
    where.name = {
      [Op.iLike]: `%${name}%`, 
    }
  }

  models.Item.findAndCountAll({
    where: where,
    // Offset and limit for pagination
    offset: ITEMS_PER_PAGE * (page - 1),
    limit: ITEMS_PER_PAGE,
    attributes: { exclude: ['shopId'] },
    include: [{
      model: models.Shop
    }]
  })
    .then(result => {
      result.numPages = Math.ceil(result.count / ITEMS_PER_PAGE);
      res.json(result);
    });
});

router.post('/', (req, res, next) => {
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
    })
    .catch(next);
});

module.exports = router;

