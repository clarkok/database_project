var credential = require("./credential");
var crypto = require("crypto");
var dateUtil = require("./utils/dateUtil").format;
var debug = require('debug')('library:model');
var Promise = require('bluebird');
var parser = Promise.promisify(require('csv-parse'));

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
exports.knex = knex;

exports.adminLogin = adminLogin;

function adminLogin(user) {
  debug(user.username + " is trying to login using password: " + user.password);

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
    query: function (data) {
      if (!data.sort_by) data.sort_by = 'bid';
      if (!data.order) data.order = 'asc';
      if (!data.page) data.page = 1;
      var offset = (data.page - 1) * 30;
      return data.conditions.reduce(function (prev, current) {
        return prev.where(current.column, current.operator, current.value);
      }, knex('book'))
        .orderBy(data.sort_by, data.order)
        .limit(30)
        .offset(offset)
        .then(function(rows) {
          return rows;
        });
    },

    borrow: function (data) {
      checkPrivilege(data);
      return knex.transaction(function(trx) {
        // check if same person borrow the same book
        return trx('borrow')
          .where({
            bid: data.bid,
            cid: data.cid,
            return_date: null
          }).then(function(rows) {
            if (rows.length > 0) {
              var result = {};
              result.code = -2;
              return result;
            }
            // get the stock of given book
            return trx('book')
              .select('stock')
              .where({ bid: data.bid })
              .then(function(rows) {
                if (rows.length === 0) {
                  var result = {};
                  result.code = -1;
                  return result;
                }
                // if not available return min due_date
                if (rows[0].stock === 0) {
                  return trx('borrow')
                    .select('due_date')
                    .where({
                      bid: data.bid,
                      return_date: null
                    })
                    .orderBy('due_date', 'asc')
                    .limit(1)
                    .then(function(rows) {
                      var result = {};
                      result.code = 1;
                      result.date = rows[0].due_date;
                      return result;
                    });
                }
                data.stock = rows[0].stock;
                // set default due_date to 30 days later
                var dueDate = new Date();
                var dueDay = dueDate.getDay() + 30;
                dueDate.setDate(dueDay);
                // try to add borrow record
                return trx('borrow').insert({
                  aid: data.aid,
                  bid: data.bid,
                  cid: data.cid,
                  borrow_date: dateUtil('yyyy-MM-dd hh:mm:ss'),
                  due_date: dateUtil(dueDate, 'yyyy-MM-dd hh:mm:ss')
                }).then(function() {
                  // decrease stock
                  return trx('book')
                    .update({ stock: data.stock - 1 })
                    .where({ bid: data.bid })
                }).then(function() {
                  var result = {};
                  result.code = 0;
                  return result;
                });
              });
          });
      });
    },

    returnBook: function (data) {
      return knex.transaction(function(trx) {
        // get stock of given book
        return trx('book')
          .select('stock')
          .where({ bid: data.bid })
          .then(function(rows) {
            if (rows.length === 0) {
              return {code: -1};
            }
            // increase stock
            data.stock = rows[0].stock;
            return trx('book')
              .update({ stock: data.stock + 1})
              .where({ bid: data.bid })
              .then(function() {
                // record return date
                return trx('borrow').where({
                  bid: data.bid,
                  cid: data.cid,
                  return_date: null
                }).update({
                  return_date: dateUtil('yyyy-MM-dd hh:mm:ss')
                });
              })
              .return({ code: 0});
          });
      });
    },

    books: function (data) {
      checkPrivilege(data);
      return knex('borrow').leftOuterJoin('book', 'borrow.bid', 'book.bid')
        .where({
          cid: data.cid,
          return_date: null
        });
    },

    listCard: function (data) {
      checkPrivilege(data);
      if (!data.sort_by) data.sort_by = 'cid';
      if (!data.order) data.order = 'asc';
      if (!data.page) data.page = 1;
      var offset = (data.page - 1) * 30;
      return data.conditions.reduce(function(prev, current) {
        return prev.where(current.column, current.operator, current.value);
      }, knex('card'))
        .orderBy(data.sort_by, data.order)
        .limit(30)
        .offset(offset);
    },

    createCard: function (data) {
      checkPrivilege(data);
      return knex('card').insert({
        name: data.name,
        unit: data.unit,
        category: data.category
      }).then(function(cid) {
        var result = {};
        result.cid = cid;
        result.code = 0;
        return result;
      });
    },

    deleteCard: function (data) {
      checkPrivilege(data);
      return knex('card')
        .where({
          cid: data.cid
        })
        .del()
        .return({ code: 0 });
    },

    createBook: function (data) {
      checkPrivilege(data);
      if (data.total < 0) throw new Error("Negative total number");
      if (data.bid.length > 0) {
        return knex('book')
          .update({
            category: data.category,
            title: data.title,
            press: data.press,
            year: data.year,
            author: data.author,
            price: data.price,
            total: data.total,
            stock: data.total,
            cover: data.cover
          })
          .where({
            bid: data.bid
          })
          .return({ code: 0 });
      }
      return knex('book')
        .insert({
          category: data.category,
          title: data.title,
          press: data.press,
          year: data.year,
          author: data.author,
          price: data.price,
          total: data.total,
          stock: data.total,
          cover: data.cover
        })
        .return({ code: 0 });
    },

    bulkCreateBook: function(data) {
      checkPrivilege(data);
      var opt = {
        delimiter: ';',
        comment: '#',
        columns: [
          'category',
          'title',
          'cover',
          'press',
          'year',
          'author',
          'price',
          'total',
          'stock'
        ]
      };
      return parser(data.file, opt)
        .then(function(output) {
          return knex('book')
            .insert(output);
        })
        .then(function(number) {
          var result = {};
          result.number = number;
          result.code = 0;
          return result;
        });
    },

    deleteBooks: function(data) {
      checkPrivilege(data);
      return data.reduce(function(prev, current) {
        return prev.orWhere({ bid: current });
      }, knex('book'))
        .del()
        .return({ code: 0 });
    }
  };
  return action[eventMap[query.action]](query.data);
}
