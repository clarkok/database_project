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
    it('should return an array', function() {
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
      return expect(model.query(query)).to.eventually.be.an('array');
    });
  });

  describe("Check borrow action", function() {
    it('should return proper code if bid not exist', function() {
      var query = {
        action: "return",
        data: {
          aid: 1,
          bid: 233333,
          cid: 1
        }
      };
      return expect(model.query(query)).to.eventually.have.property('code', -1);
    });

    it('should return proper code if borrow succeed', function() {
      var query = {
        action: "borrow",
        data: {
          aid: 1,
          bid: 1,
          cid: 1
        }
      };
      return expect(model.query(query)).to.eventually.have.property('code', 0);
    });

    it('should return proper code and due date if book not available', function() {
      var query = {
        action: "borrow",
        data: {
          aid: 1,
          bid: 1,
          cid: 2
        }
      };
      return expect(model.query(query)).to.eventually.have.property('code', 1);
    });

    it('should return proper code if same person borrow the same book twice', function() {
      var query = {
        action: "borrow",
        data: {
          aid: 1,
          bid: 1,
          cid: 1
        }
      };
      return expect(model.query(query)).to.eventually.have.property('code', -2);
    });
  });

  describe("Check return action", function() {
    it('should return proper code if bid not exist', function() {
      var query = {
        action: "return",
        data: {
          aid: 1,
          bid: 233333,
          cid: 1
        }
      };
      return expect(model.query(query)).to.eventually.have.property('code', -1);
    });

    it('should return proper code if return succeed', function() {
      var query = {
        action: "return",
        data: {
          aid: 1,
          bid: 1,
          cid: 1
        }
      };
      return expect(model.query(query)).to.eventually.have.property('code', 0);
    });
  });
});

