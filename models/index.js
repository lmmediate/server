const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://hes:shopdiscounts@localhost:5432/easysales',
  {
    define: {
      timestamps: false
    }
  });

const Item = sequelize.import('./item');
const Account = sequelize.import('./account');
const ShopList = sequelize.import('./shoplist');
const CustomItem = sequelize.import('./custom_item');

Item.belongsToMany(Account, { through: ShopList });
Account.belongsToMany(Item, { through: ShopList });
Account.hasMany(CustomItem, { as: 'CustomItems' });
CustomItem.belongsTo(Account);

module.exports.Item = Item;
module.exports.Account = Account;
module.exports.ShopList = ShopList;

