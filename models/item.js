/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('item', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    oldPrice: {
      type: DataTypes.DOUBLE,
    },
    newPrice: {
      type: DataTypes.DOUBLE,
    },
    dateIn: {
      type: DataTypes.DATEONLY,
    },
    dateOut: {
      type: DataTypes.DATEONLY,
    },
    crawlDate: {
      type: DataTypes.DATEONLY,
    },
    condition: {
      type: DataTypes.STRING,
    },
    image: {
      type: "BYTEA",
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    discount: {
      type: DataTypes.STRING,
    }
  });
};
