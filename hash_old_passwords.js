var CryptoJS = require('crypto-js');
var models = require('./models');

function hash(password) {
  return CryptoJS.SHA256(password) + "";
}

models.Account.findAll()
  .then(accounts => {
    for(var i = 0; i < accounts.length; i++) {
      accounts[i].password = hash(accounts[i].password);
      console.log(accounts[i].password);
      accounts[i].save();
    }
  });
