/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customItem', {
    item: {
      type: DataTypes.STRING,
    }
  });
};
