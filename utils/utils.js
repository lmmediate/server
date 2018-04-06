const { Op } = require('sequelize')

var actualItemsWhere = function(op) {
  var where = {
    dateIn: {
      [Op.lte]: new Date() 
    },
    dateOut: {
      [Op.gte]: new Date()
    }
  }
  for (prop in op) {
    if(op.hasOwnProperty(prop)) {
      where[prop] = op[prop];
    }
  }
  console.log(where);
  return where;
};


module.exports.actualItemsWhere = actualItemsWhere;
