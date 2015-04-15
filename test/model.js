/**
 * Created by MForever78 on 15/4/14.
 */

var model = require('../model');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;

chai.use(chaiAsPromised);


describe("Actions", function() {
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
    });
  });

  describe("Check borrow action", function() {
    it('should return an array with only one element', function() {
      var query = {
        action: "borrow",
        data: {
          aid: 1,
          bid: 1,
          cid: 1
        }
      };
      return expect(model.query(query)).to.eventually.be.a('array')
        .and.have.length(1);
    });
  });
});

