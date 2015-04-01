# 数据库大程

数据库大大大大大大大大大大大大大大大大大大大大大程

## Required Library

- Express
- Knex
- Socket.io
- mySQL

## Usage

1. `npm install`
2. Create a database, and a user on mySQL. For example:
```sql
create database <database_name>;
create user '<user_name>'@'localhost' identified by '<some_password>';
grant all privileges on <database_name>.* to '<user_name>'@'localhost';
```
3. Create a credential.js file which stores your database information:
```js
module.exports = {
    user: '<user_name>',
    password: '<some_password>',
    database: '<database_name>'
}
```
4. `node init_database.js` to create essential tables.
4. `node library.js` and you are good to go.
