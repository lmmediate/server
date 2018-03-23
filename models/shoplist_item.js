/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shoplistItem', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });
};
