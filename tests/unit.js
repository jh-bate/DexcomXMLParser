var salinity = require('salinity');

var expect = salinity.expect;

describe('the parser', function() {

    it('can be loaded', function(done) {

      var dxParser = require('../');

      expect(dxParser).to.exist;
      done();
    });

    it('has a method to get sugars', function(done) {

      var dxParser = require('../');

      expect(dxParser.sugars).to.exist;
      done();
    });

    it('has a method to get sugars', function(done) {

      var dxParser = require('../');

      expect(dxParser.sugars).to.exist;
      done();
    });

    it('has a method to get cbg', function(done) {

      var dxParser = require('../');

      expect(dxParser.cbg).to.exist;
      done();
    });

    it('has a method to say hello', function(done) {

      var dxParser = require('../');

      expect(dxParser.sayHello).to.exist;
      done();
    });

});