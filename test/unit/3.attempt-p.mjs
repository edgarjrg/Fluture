/* eslint prefer-promise-reject-errors: 0 */

import chai from 'chai';
import {attemptP, map, mapRej} from '../../index.mjs';
import {assertCrashed, assertRejected, assertResolved, assertValidFuture, error, failRej, failRes, noop, test} from '../util/util.mjs';
import {testFunction, functionArg} from '../util/props.mjs';

var expect = chai.expect;

testFunction('encaseP', attemptP, [functionArg], assertValidFuture);

test('crashes when the Promise generator throws', function (){
  var m = attemptP(function (){ throw error });
  return assertCrashed(m, error);
});

test('crashes when the Promise generator does not return a Promise', function (){
  var m = attemptP(noop);
  return assertCrashed(m, new TypeError(
    'encaseP() expects the function it\'s given to return a Promise/Thenable\n' +
    '  Actual: undefined\n' +
    '  From calling: function (){}\n' +
    '  With: undefined'
  ));
});

test('resolves with the resolution value of the returned Promise', function (){
  var actual = attemptP(function (){ return Promise.resolve(1) });
  return assertResolved(actual, 1);
});

test('rejects with rejection reason of the returned Promise', function (){
  var actual = attemptP(function (){ return Promise.reject(error) });
  return assertRejected(actual, error);
});

test('ensures no resolution happens after cancel', function (done){
  var actual = attemptP(function (){ return Promise.resolve(1) });
  actual._interpret(done, failRej, failRes)();
  setTimeout(done, 20);
});

test('ensures no rejection happens after cancel', function (done){
  var actual = attemptP(function (){ return Promise.reject(1) });
  actual._interpret(done, failRej, failRes)();
  setTimeout(done, 20);
});

test('crashes with errors that occur in rejection continuation', function (){
  var m = map(function (){ throw error })(attemptP(function (){ return Promise.resolve(1) }));
  return assertCrashed(m, error);
});

test('crashes with errors that occur in resolution continuation', function (){
  var m = mapRej(function (){ throw error })(attemptP(function (){ return Promise.reject(1) }));
  return assertCrashed(m, error);
});

test('returns the code to create the Future when cast to String', function (){
  var f = function (){ return Promise.resolve(42) };
  var m = attemptP(f);
  expect(m.toString()).to.equal('encaseP (' + f.toString() + ') (undefined)');
});
