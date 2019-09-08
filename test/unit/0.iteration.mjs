import chai from 'chai';
import {test} from '../util/util.mjs';
import {Next, Done, isIteration} from '../../src/internal/iteration.mjs';

var expect = chai.expect;

test('Next', function (){
  var actual = Next(42);
  expect(isIteration(actual)).to.equal(true);
  expect(actual.done).to.equal(false);
  expect(actual.value).to.equal(42);
});

test('Done', function (){
  var actual = Done(42);
  expect(isIteration(actual)).to.equal(true);
  expect(actual.done).to.equal(true);
  expect(actual.value).to.equal(42);
});
