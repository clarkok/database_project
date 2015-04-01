var db = require("./credential");

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: db.user,
    password: db.password,
    database: db.database
  }
});

module.exports = knex;
