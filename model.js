var credential = require("./credential");
var Bluebird = require("bluebird");
var crypto = Bluebird.promisifyAll(require("crypto"));
var dateUtil = require("./utils/dateUtil");

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: credential.db.host,
    user: credential.db.user,
    password: credential.db.password,
    database: credential.db.database
  }
});

exports = module.exports;

exports.adminLogin = adminLogin;

function adminLogin(user) {
  console.log(user.username + " is trying to login using password: " + user.password);

  return knex.select('salt')
    .from('admin')
    .where({ username: user.username })
    .then(function(rows) {
      if (rows.length === 0) {
        throw new Error("Can't find username");
      }
      // Username found, calculate hash
      var hash = crypto.createHash('sha1');
      user.password = hash.update(rows[0].salt).update(user.password).digest('hex');
      
      return knex.select('aid')
        .from('admin')
        .where({
          username: user.username,
          password: user.password
        })
        .then(function(rows) {
          if (rows.length === 0) {
            throw new Error("Wrong password");
          }
          // Auth succeed, create session
          user.aid = rows[0].aid;
          return user;
        })
    });
}

var eventMap = {
  'query': 'query',
  'borrow': 'borrow',
  'return': 'returnBook',
  'books': 'books',
  'list_card': 'listCard',
  'new_card': 'createCard',
  'delete_card': 'deleteCard',
  'new_book': 'createBook',
  'new_books': 'bulkCreateBook',
  'delete_books': 'deleteBooks'
};

exports.query = query;

function query(query) {
  var action = {
    query: function(data) {
      return data.conditions.reduce(function(prev, current) {
        return prev.where(current.column, current.operator, current.value);
      }, knex('books'));
    }
  };
  return action[query.action](query.data);
}
