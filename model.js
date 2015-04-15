var credential = require("./credential");
var crypto = require("crypto");
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
        });
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

function checkPrivilege(data) {
  if (!data.aid) {
    throw new Error("Unauthorized action!");
  }
}

exports.query = query;

function query(query) {
  var action = {
    query: function(data) {
      return data.conditions.reduce(function(prev, current) {
        return prev.where(current.column, current.operator, current.value);
      }, knex('book'));
    },

    borrow: function(data) {
      checkPrivilege(data);
      return knex('borrow').insert({
        aid: data.aid,
        bid: data.bid,
        cid: data.cid,
        borrow_date: dateUtil('yyyy-MM-dd hh:mm:ss')
      });
    },

    returnBook: function(data) {
      return knex('borrow').where({
        bid: data.bid,
        cid: data.cid
      }).update({
        return_data: dateUtil('yyyy-MM-dd hh:mm:ss')
      });
    },

    books: function(data) {
      checkPrivilege(data);
      return knex('borrow').leftOuterJoin('book', 'borrow.bid', 'book.bid')
        .where({
          cid: data.cid,
          return_date: null
        });
    },

    listCard: function(data) {
      checkPrivilege(data);
      return knex('card');
    },

    createCard: function(data) {
      checkPrivilege(data);
      return knex('card').insert({
        name: data.name,
        unit: data.unit,
        category: data.category
      });
    },

    deleteCard: function(data) {
      checkPrivilege(data);
      return knex('card')
        .where({
          cid: data.cid
        })
        .del();
    },

    createBook: function(data) {
      checkPrivilege(data);
      return knex('book')
        .insert({
          category: data.category,
          title: data.title,
          press: data.press,
          year: data.year,
          author: data.author,
          price: data.price,
          total: data.total,
          stock: data.total
        });
    }
  };
  return action[eventMap[query.action]](query.data);
}
