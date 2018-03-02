/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shoplist', {
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'account_id',
      // primaryKey: true,
      references: {
        model: 'account',
        key: 'id'
      }
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'item_id',
      references: {
        model: 'item',
        key: 'id'
      }
    }
  },
    {
      tableName: 'shoplist'
    });
};
