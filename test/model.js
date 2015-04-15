/**
 * Created by MForever78 on 15/4/14.
 */

var model = require('../model');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;

chai.use(chaiAsPromised);


describe("Actions", function() {
  //describe("Check support actions", function() {
  //  it('should support all the valid actions', function() {
  //    var validActions = [
  //      'query',
  //      'borrow',
  //      'return',
  //      'books',
  //      'list_card',
  //      'delete_card',
  //      'new_card',
  //      'new_book',
  //      'new_books',
  //      'delete_books'
  //    ];
  //  });
  //});

  describe("Check query action", function() {
    it('should return an object with action and data property', function() {
      var query = {
        action: "query",
        data: {
          conditions: [{
            column: "stock",
            operator: ">",
            value: 0
          }]
        }
      };
      return expect(model.query(query)
        .then(function(data) {
          var result = {};
          result.data = data;
          result.action = query.action;
          return result;
        })).to.eventually.have.property('action', 'query');
    })
  })
});

