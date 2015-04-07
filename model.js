var db = require("./credential");
var Bluebird = require("bluebird");
var crypto = Bluebird.promisifyAll(require("crypto"));
var dateUtil = require("./utils/dateUtil");

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
  }
});

function adminLogin(user) {
  console.log(user.username + " is trying to login using password: " + user.password);

  return knex.select('salt')
    .from('admin')
    .where({ username: user.username })
    .then(function(rows) {
      if (rows.length === 0) {
        throw new Error("Can't find username");
      }
      var hash = crypto.createHash('sha1');
      user.password = hash.update(rows[0].salt).update(user.password).digest('hex');
      
      return knex.select('aid')
        .from('admin')
        .where({
          username: user.username,
          password: user.password
        })
        .then(function(rows) {
          user.aid = rows[0].aid;
          crypto.randomBytes(128).then(function(buffer) {
            user.token = buffor.toString('hex');
            
            var create = new Date();
            var expire = new Date();
            expire.setMinutes(expire.getMinutes() + 30);
            knex('session').insert({
              token: user.token,
              aid: user.aid,
              create_at: dateUtil.format(create, 'yyyy-MM-dd hh:mm:ss'),
              expire_at: dateUtil.format(expire, 'yyyy-MM-dd hh:mm:ss')
            });

            return user;
          })
          .catch(function(err) {
            console.log("Crypto error!");
            console.error(err.stack);
            return err;
          });
          return user;
        });
    });

}

module.exports.connect = knex;
module.exports.adminLogin = adminLogin;
