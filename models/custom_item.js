/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('custom_item', {
    accountId: {
      field: 'account_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'account',
        key: 'id'
      }
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'custom_item'
  });
};
