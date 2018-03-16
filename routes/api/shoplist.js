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
        [Op.iLike]: '%' + item.item + '%'
      }
    }
  })
    .then(items => {
      item = item.toJSON();
      item.matchingItems = items.map(i => i.toJSON());
      return item;
    });
}

router.get('/', (req, res) => {
  var shoplist = {};
  models.Account.findOne({
    where: {
      id: req.user.id
    }
  })
    .then(user => {
      return Promise.all([
        user.getItems({
          include: [{model: models.Shop}]
        }),
        user.getCustomItems() 
      ]); 
    })
    .then(data => {
      shoplist.items = data[0].map(item => item.toJSON());
      return Promise.map(data[1], item => {
        return applyMatchingItems(item);
      })
    })
    .then(customItems => {
      shoplist.customItems = customItems;
      res.json(shoplist);
    });
});

router.post('/add', (req, res) => {
  var userId = req.user.id;

  var itemId = req.query['id'];
  var customItemName = req.query['custom'];

  if(!customItemName && itemId) {
    models.Account.findOne({ where: { id: userId } })
      .then(user => {
        models.Item.findOne({ where: { id: itemId } })
          .then(item => {
            user.addItem(item);
            res.sendStatus(200);
          });
      });
  } else if(!itemId && customItemName) {
    models.Account.findOne({ where: { id: userId } })
      .then(user => {
        user.createCustomItem({item: customItemName})
          .then(item => {
            applyMatchingItems(item)
              .then(a => res.json(a));
          });
      });
  } else {
    res.status(500).send('Missing query params.');
  }
});

router.delete('/delete', (req, res) => {
  var userId = req.user.id;
  var itemId = req.query['id'];
  var customItemId = req.query['customid'];

  if(!customItemId && itemId) {
    models.Account.findOne({ where: { id: userId } })
      .then(user => {
        user.removeItem(itemId)
          .then(() => res.sendStatus(200));
      });
  } else if(!itemId && customItemId) {
    models.Account.findOne({ where: { id: userId } })
      .then(user => {
        user.removeCustomItems(customItemId)
          .then(() => res.sendStatus(200));
      });
  } else {
    res.status(500).send('Missing query params.');
  }
});

module.exports = router;
