const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const models = require('../../models');

router.get('/', (req, res) => {
  models.Account.findOne({
    where: {
      id: req.user.id
    }
  })
    .then(user => {
      return user.getItems();
    })
    .then(items => {
      res.json(items);
    });
});

router.post('/:item_id', (req, res) => {
  var itemId = req.params['item_id'];
  var userId = req.user.id;
  models.Account.findOne({ where: { id: userId } })
    .then(user => {
      models.Item.findOne({ where: { id: itemId } })
        .then(item => {
          user.addItem(item);
          res.sendStatus(200);
        });
    });
});

router.delete('/:item_id', (req, res) => {
  var itemId = req.params['item_id'];
  var userId = req.user.id;
  models.ShopList.destroy({
    where: {
      accountId: userId,
      itemId: itemId
    }
  });
  res.sendStatus(200);
});

module.exports = router;
