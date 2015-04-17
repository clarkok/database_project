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
    it('should fail if bid not exist', function() {
      var query = {
        action: "return",
        data: {
          aid: 1,
          bid: 233333,
          cid: 1
        }
      };
      return expect(model.query(query)).to.be.rejectedWith(/Invalid bid/);
    });

    it('should succeed and return 1', function() {
      var query = {
        action: "borrow",
        data: {
          aid: 1,
          bid: 1,
          cid: 1
        }
      };
      return expect(model.query(query)).to.eventually.equal(1)
    });

    it('should fail if same person borrow the same book twice', function() {
      var query = {
        action: "borrow",
        data: {
          aid: 1,
          bid: 1,
          cid: 1
        }
      };
      return expect(model.query(query)).to.be.rejectedWith(/Repeat borrow/);
    })
  });

  describe("Check return action", function() {
    it('should fail if bid not exist', function() {
      var query = {
        action: "return",
        data: {
          aid: 1,
          bid: 233333,
          cid: 1
        }
      };
      return expect(model.query(query)).to.be.rejectedWith(/Invalid bid/);
    });

    it('should succeed and return 1', function() {
      var query = {
        action: "return",
        data: {
          aid: 1,
          bid: 1,
          cid: 1
        }
      };
      return expect(model.query(query)).to.eventually.equal(1);
    });
  });
});

