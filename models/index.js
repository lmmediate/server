const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://hes:shopdiscounts@localhost:5432/easysales',
  {
    define: {
      timestamps: false,
      // underscored: true,
      freezeTableName: true,
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

// sequelize.sync({force: true})
// .then(() => {
//   Account.bulkCreate([
//     {username: 'maxim', password: 'password'},
//     {username: 'root', password: 'root'}
//   ])
//     .then(() => console.log('\n\nCREATED\n\n'));
//   Shop.bulkCreate([
//     {"id":1,"alias":"dixy","name":"Дикси"},
//     {"id":2,"alias":"perekrestok","name":"Перекресток"}
//   ])
//     .then(() => console.log('\n\nCREATED\n\n'));
// });

module.exports.Item = Item;
module.exports.CustomItem = CustomItem;
module.exports.Account = Account;
module.exports.ShopList = ShopList;
module.exports.ShopListItem = ShopListItem;
module.exports.Shop = Shop;

