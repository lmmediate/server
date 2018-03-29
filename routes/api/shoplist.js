const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const models = require('../../models');
const Promise = require('bluebird');

function applyMatchingItems(item) {
  return models.Item.findAll({
    where: {
      dateIn: {
        [Op.lte]: new Date() 
      },
      dateOut: {
        [Op.gte]: new Date()
      },
      name: {
        [Op.iLike]: '%' + item.name + '%'
      }
    },
    include: [{model: models.Shop}]
  })
    .then(items => {
      item = item.toJSON();
      item.matchingItems = items.map(i => i.toJSON());
      return item;
    });
}

router.get('/', (req, res) => {
  var preview = (req.query['preview'] === 'true');

  // include shoplist name and id by default
  var include = [{
    model: models.ShopList,
    attributes: ['id', 'name']
  }];

  // include 'items' and 'customItems' arrays in shoplist
  // if preview is enabled
  if(preview) {
    include[0].include = [{
      model: models.Item,
      through: {attributes: []},
      attributes: ['name'],
    }, {
      model: models.CustomItem,
      attributes: ['name']
    }]
  }

  models.Account.findOne({
    attributes: [],
    where: {
      id: req.user.id
    },
    include: include 
  })
    .then(user => {
      var shoplists = user.toJSON().shoplists.map(shoplist => {
        if(shoplist.items) {
          shoplist.items = shoplist.items.map(i => i.name); 
        }
        if(shoplist.customItems) {
          shoplist.customItems = shoplist.customItems.map(i => i.name);
        }
        return shoplist;
      });
      res.json(shoplists);
    });
});

router.get('/:id', (req, res) => {
  models.Account.findOne({
    attributes: [],
    where: {
      id: req.user.id
    },
    include: [{
      model: models.ShopList,
      attributes: ['id', 'name'],
      where: {
        id: req.params['id']
      },
      include: [{
        model: models.Item,
        through: {attributes: []},
        attributes: { exclude: ['shopId'] },
        include: [{
          model: models.Shop
        }]
      }, {
        model: models.CustomItem,
        attributes: ['id', 'name']
      }]
    }]
  })
    .then(user => {
      var shoplist = user.shoplists.shift();
      return Promise.all([
        Promise.resolve(shoplist.toJSON()),
        Promise.map(shoplist.customItems, applyMatchingItems)
      ]);
    })
    .then(data => {
      var shoplist = data[0];
      shoplist.customItems = data[1];
      res.json(shoplist);
    });
});

router.post('/:id/add', (req, res) => {
  var userId = req.user['id'];
  var shoplistId = req.params['id'];
  var itemId = req.query['id'];
  var customItemName = req.query['custom'];

  models.Account.findOne({
    where: { 
      id: userId 
    },
    include: [{
      model: models.ShopList,
      where: {
        id: shoplistId
      }
    }]
  })
    .then(user => {
      var shoplist = user.shoplists.shift();
      if(!customItemName && itemId) {
        models.Item.findOne({ where: { id: itemId } })
          .then(item => {
            if(item) {
              shoplist.addItem(item).then(() => res.sendStatus(200));
            } else {
              res.status(404).send('No such item');
            }
          });
      } else if(!itemId && customItemName) {
        shoplist.createCustomItem({name: customItemName})
          .then(item => applyMatchingItems(item))
          .then(a => res.json(a));
      } else {
        res.status(500).send('Missing query params.');
      }
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

router.delete('/:id/delete', (req, res) => {
  var userId = req.user.id;
  var itemId = req.query['id'];
  var customItemId = req.query['customid'];
  var shoplistId = req.params['id'];

  console.log('\t' + itemId);

  models.Account.findOne({
    where: { 
      id: userId 
    },
    include: [{
      model: models.ShopList,
      where: {
        id: shoplistId
      }
    }]
  })
    .then(user => {
      var shoplist = user.shoplists.shift();
      if(!customItemId && itemId) {
        shoplist.removeItems(itemId)
          .then(() => res.sendStatus(200));
      } else if(!itemId && customItemId) {
            shoplist.removeCustomItems(customItemId)
              .then(() => res.sendStatus(200));
      } else {
        res.status(500).send('Missing query params.');
      }
    })
    .catch(error => res.status(500).send(error));
  
});

// TODO: detele shoplist 
// TODO: create shoplist

module.exports = router;
