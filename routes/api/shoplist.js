const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const models = require('../../models');

router.get('/', (req, res) => {
  var shoplist = {};
  models.Account.findOne({
    where: {
      id: req.user.id
    }
  })
    .then(user => {
      user.getItems().then(items => {
        shoplist.items = items.map(i => i.toJSON());
        user.getCustomItems().then(items => {
          shoplist.customItems = items.map(i => i.toJSON());
          res.json(shoplist);
        });
      });
    })
});

router.post('/add/', (req, res) => {
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
          .then(item => res.json(item));
      });
  } else {
    res.status(500).send('Missing query params.');
  }
});

router.delete('/delete', (req, res) => {
  var userId = req.user.id;
  var itemId = req.query['id'];
  models.ShopList.destroy({
    where: {
      accountId: userId,
      itemId: itemId
    }
  })
    .then(() => res.sendStatus(200));
});

module.exports = router;
