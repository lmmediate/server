/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shoplistItem', {
    shoplistId: {
      field: 'shoplist_id',
      type: DataTypes.INTEGER,
      allowNull: false
    },
    itemId: {
      field: 'item_id',
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'shoplist_item'
  });
};
