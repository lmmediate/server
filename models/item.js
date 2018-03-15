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
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    oldPrice: {
      field: 'old_price',
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    newPrice: {
      field: 'new_price',
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    dateIn: {
      field: 'date_in',
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dateOut: {
      field: 'date_out',
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    crawlDate: {
      field: 'crawl_date',
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: "BYTEA",
      allowNull: true
    },
    imageUrl: {
      field: 'image_url',
      type: DataTypes.STRING,
      allowNull: true
    },
    discount: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shop: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'item'
  });
};
