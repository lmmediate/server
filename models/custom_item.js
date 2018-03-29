/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customItem', {
    name: {
      type: DataTypes.STRING,
    }
  });
};
