/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('custom_item', {
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.INTEGER,
      field: 'account_id',
      allowNull: false,
      references: {
        model: 'account',
        key: 'id'
      }
    },
  }, {
    tableName: 'custom_item'
  });
};
