/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shoplist', {
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'account',
        key: 'id'
      }
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'item',
        key: 'id'
      }
    }
  }, {
    tableName: 'shoplist'
  });
};
