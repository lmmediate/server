const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const models = require('../../models');

router.get('/', (req, res) => {
  models.Account.findOne({
    where: {
      username: req.user.username
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
  models.Account.findOne({ where: { username: req.user.username } })
    .then(user => {
      models.Item.findOne({ where: { id: itemId } })
        .then(item => {
          user.addItem(item);
          res.sendStatus(200);
        });
    })
});

module.exports = router;
