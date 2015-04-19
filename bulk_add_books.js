#!/usr/local/bin/node
/**
 * Created by MForever78 on 15/4/19.
 */

var model = require("./model");
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));

fs.readFileAsync("./file", "utf-8")
  .then(function(file) {
    var opt = {
      action: 'new_books',
      data: {
        aid: 1,
        file: file
      }
    };
    return model.query(opt)
      .then(function(result) {
        console.log("Books added.");
      })
  })
  .then(function() {
    process.exit(0);
  })
  .catch(function(err) {
    console.log("Something broke...");
    console.error(err.stack);
    process.exit(1);
  })

