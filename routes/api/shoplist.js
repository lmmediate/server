const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const models = require('../../models');
const Promise = require('bluebird');

// item - plain json object,
// not sequelize model
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
    attributes: { exclude: ['shopId'] },
    include: [{
      model: models.Shop,
    }]
  })
    .then(items => {
      item.matchingItems = items.map(i => i.toJSON());
      return item;
    });
}

router.get('/', (req, res) => {
  var mode = req.query['mode'];

  // include shoplist name and id by default
  var include = [{
    model: models.ShopList,
    attributes: ['id', 'name']
  }];

  // include an 'item' and 'customItem' in shoplist
  // if full mode is enabled
  //
  // include an 'item.name' and 'customItem.name'
  // if preview mode is enabled
  if(mode === 'preview') {
    include[0].include = [{
      model: models.Item,
      through: {attributes: []},
      attributes: ['name']
    }, {
      model: models.CustomItem,
      attributes: ['name']
    }]
  } else if (mode === 'full') {
    include[0].include = [{
      model: models.Item,
      through: {attributes: []},
      attributes: { exclude: ['shopId'] },
      include: [{
        model: models.Shop
      }]
    }, {
      model: models.CustomItem
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
      var shoplists = user.toJSON().shoplists;
      if(mode === 'preview') {
        // display items as plain text 
        // if preview mode is enabled
        // ['milk', 'water', ... ]
        shoplists = shoplists.map(shoplist => {
          shoplist.items = shoplist.items.map(i => i.name); 
          shoplist.customItems = shoplist.customItems.map(i => i.name);
          return shoplist;
        });
        res.json(shoplists);
      } else if(mode === 'full') {
        // apply matching items to every
        // custom item in every shoplist
        Promise.all([
          Promise.resolve(shoplists),
          Promise.all(
            shoplists.map(shoplist => {
              return Promise.map(shoplist.customItems, applyMatchingItems);
            })
          )])
          .then(data => {
            var sh = data[0];
            sh.customItems = data[1];
            res.json(sh);
          });
      } else {
        res.json(shoplists);
      }
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
        Promise.map(shoplist.toJSON().customItems, applyMatchingItems)
      ]);
    })
    .then(data => {
      var shoplist = data[0];
      shoplist.customItems = data[1];
      res.json(shoplist);
    });
});

router.post('/:id/additem', (req, res) => {
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
          .then(item => applyMatchingItems(item.toJSON()))
          .then(a => res.json(a));
      } else {
        res.status(500).send('Missing query params.');
      }
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

router.delete('/:id/deleteitem', (req, res) => {
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

router.delete('/:id', (req, res) => {
  var shoplistId = req.params['id'];
  var userId = req.user.id;
  models.Account.findOne({
    where: {
      id: userId
    }
  })
    .then(user => {
      user.removeShoplist(shoplistId);
    })
    .then(() => res.sendStatus(200));
});

router.post('/', (req, res) => {
  var userId = req.user.id;
  var shoplist = req.body;

  models.Account.findOne({
    where: {
      id: userId
    }
  })
    .then(user => {
      return user.createShoplist(shoplist);
    })
    .then(data => { 
      data = data.toJSON();
      // Attach arrays since they are
      // required in front-end
      data.items = [];
      data.customItems = [];
      res.json(data)
    });
});

module.exports = router;
