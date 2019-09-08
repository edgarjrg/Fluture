import chai from 'chai';
import {test} from '../util/util.mjs';
import {setImmediateFallback} from '../../src/internal/utils.mjs';

var expect = chai.expect;

test('setImmediateFallback', function (done){
  var t = setTimeout(done, 25, new Error('Time is up'));
  setImmediateFallback(function (x){
    expect(x).to.equal(42);
    clearTimeout(t);
    done();
  }, 42);
});
