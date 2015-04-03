# 数据库大程

数据库大大大大大大大大大大大大大大大大大大大大大程

## Required Library

- Express
- Knex
- Socket.io
- MySQL

## Usage

1. `npm install`
2. Create a database, and a user on MySQL. For example:

    ```sql
    create database <database_name>;
    create user '<user_name>'@'localhost' identified by '<some_password>';
    grant all privileges on <database_name>.* to '<user_name>'@'localhost';
    ```

3. Create a `credential.js` file in the project directory (i.e. `./`) which stores your database information:

    ```js
    module.exports = {
        host: '<host_name or IP address>',
        user: '<user_name>',
        password: '<some_password>',
        database: '<database_name>'
    };
    ```

4. `node init_database.js` to create essential tables.
5. `node library.js` and you are good to go.

## Database Structure

### Table: book

Column     |Data Type          |Nullable   |Key
---        |---                |---        |---
bid        |int(10) unsigned   |NO         |Primary
category   |varchar(255)       |YES        |
title      |varchar(255)       |YES        |
press      |varchar(255)       |YES        |
year       |int(11)            |YES        |
author     |varchar(255)       |YES        |
price      |decimal(8,2)       |YES        |
total      |int(11)            |NO         |
stock      |int(11)            |NO         |

### Table: card

Column     |Data Type                   |Nullable   |Key
---        |---                         |---        |---
cid        |int(10) unsigned            |NO         |Primary
name       |varchar(255)                |NO         |
unit       |varchar(255)                |YES        |
category   |enum('teacher','student')   |YES        |

### Table: admin

Column     |Data Type        |Nullable   |Key
---        |---              |---        |---
aid        |int(10) unsigned | NO        |Primary
username   |varchar(255)     | NO        |Unique
salt       |varchar(255)     | NO        |
password   |varchar(255)     | NO        |
phone      |varchar(255)     | YES       |

### Table: borrow

Column      |Data Type         |Nullable    |Key
---         |---               |---         |---
id          | int(10) unsigned | NO         |Primary
bid         | int(10) unsigned | NO         |References book.bid
cid         | int(10) unsigned | NO         |References card.cid
borrow_date | datetime         | NO         |
return_date | datetime         | YES        |
aid         | int(10) unsigned | NO         |References admin.aid

### Table: session

Column      |Data Type         |Nullable    |Key
---         |---               |---         |---
id          | int(10) unsigned | NO         |Primary
token       | varchar(255)     | NO         |
aid         | int(10) unsigned | NO         |References admin.aid
create_at   | datetime         | NO         |
expire_at   | datetime         | NO         |
