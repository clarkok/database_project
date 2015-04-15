var db = require('./credential.js').db;
var dateUtil = require('./utils/dateUtil.js');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
  },
  debug: true
});

knex.schema.createTable('book', function(table) {
  table.increments('bid');
  table.string('category');
  table.string('title');
  table.string('press');
  table.integer('year');
  table.string('author');
  table.decimal('price');
  table.integer('total').notNullable();
  table.integer('stock').notNullable();
})

.createTable('card', function(table) {
  table.increments('cid');
  table.string('name').notNullable();
  table.string('unit');
  table.enu('category', ['teacher', 'student']);
})

.createTable('admin', function(table) {
  table.increments('aid');
  table.string('username').notNullable().unique();
  table.string('salt').notNullable();
  table.string('password').notNullable();
  table.string('phone');
})

.createTable('borrow', function(table) {
  table.increments('id');
  table.integer('bid').notNullable().unsigned().references('bid').inTable('book');
  table.integer('cid').notNullable().unsigned().references('cid').inTable('card');
  table.dateTime('borrow_date').notNullable();
  table.dateTime('return_date');
  table.integer('aid').unsigned().notNullable().references('aid').inTable('admin');
})

.then(function() {
  console.log('Create tables succeed!');
  process.exit(0);
})

.catch(function(e) {
  console.error(e);
  console.log('There was an error!');
  console.log('Rolling back...');

  // drop all generated garbage, order matters
  knex.schema.dropTableIfExists('borrow')
    .dropTableIfExists('admin')
    .dropTableIfExists('card')
    .dropTableIfExists('book')
    .then(function() {
      console.log('Shutting down... Please check your database condition');
      process.exit(1);
    });
});

