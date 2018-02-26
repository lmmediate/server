const express = require('express');
const Sequelize = require('sequelize');


const sequelize = new Sequelize('postgres://hes:shopdiscounts@localhost:5432/easysales',
  {
    define: {
      timestamps: false
    }
  });

const Account = sequelize.import(__dirname + "/models/item")

Account.findAll().then(users => {
  users.forEach(u => console.log(u.name));
})

const app = express();
const port = 8080;

app.listen(port, function() {
  console.log('Server started on port ' + port);
});
