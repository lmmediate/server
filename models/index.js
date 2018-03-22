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
const ShopListItem = sequelize.import('./shoplist_item');
const CustomItem = sequelize.import('./custom_item');
const Shop = sequelize.import('./shop');

Account.hasMany(ShopList);
ShopList.belongsTo(Account);
Item.belongsToMany(ShopList, { through: ShopListItem });
ShopList.belongsToMany(Item, { through: ShopListItem });
Account.hasMany(CustomItem);
CustomItem.belongsTo(Account);
Shop.hasMany(Item);
Item.belongsTo(Shop);

module.exports.Item = Item;
module.exports.CustomItem = CustomItem;
module.exports.Account = Account;
module.exports.ShopList = ShopList;
module.exports.ShopListItem = ShopListItem;
module.exports.Shop = Shop;

