var db = require('./credential.js');

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
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
  table.integer('total');
  table.integer('stock');
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
  table.integer('bid').unsigned().references('bid').inTable('book');
  table.integer('cid').unsigned().references('cid').inTable('card');
  table.dateTime('borrow_date');
  table.dateTime('return_date');
  table.integer('aid').unsigned().references('aid').inTable('admin');
})

.catch(function(e) {
  console.error(e);
  console.log('There was an error!');
  console.log('Shutting down...');
  process.exit(1);
})

.then(function() {
  console.log('Create tables succeed!');
  return process.exit(0);
});
