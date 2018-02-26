const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('postgres://hes:shopdiscounts@localhost:5432/easysales',
  {
    define: {
      timestamps: false
    }
  });

const Item = sequelize.import(path.join(__dirname, 'item'));
const Account = sequelize.import(path.join(__dirname, 'account'));
const ShopList = sequelize.import(path.join(__dirname, 'shoplist'));

module.exports.Item = Item;
module.exports.Account = Account;
module.exports.ShopList = ShopList;

