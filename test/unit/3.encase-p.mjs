/* eslint prefer-promise-reject-errors: 0 */

import chai from 'chai';
import {encaseP} from '../../index.mjs';
import {test, assertCrashed, assertRejected, assertResolved, assertValidFuture, error, failRej, failRes, noop} from '../util/util.mjs';
import {testFunction, functionArg, anyArg} from '../util/props.mjs';

var expect = chai.expect;

testFunction('encaseP', encaseP, [functionArg, anyArg], assertValidFuture);

test('crashes when the Promise generator throws', function (){
  var m = encaseP(function (){ throw error })(1);
  return assertCrashed(m, error);
});

test('crashes when the Promise generator does not return a Promise', function (){
  var m = encaseP(noop)(1);
  return assertCrashed(m, new TypeError(
    'encaseP() expects the function it\'s given to return a Promise/Thenable\n' +
    '  Actual: undefined\n' +
    '  From calling: function (){}\n' +
    '  With: 1'
  ));
});

test('resolves with the resolution value of the returned Promise', function (){
  var actual = encaseP(function (x){ return Promise.resolve(x + 1) })(1);
  return assertResolved(actual, 2);
});

test('rejects with rejection reason of the returned Promise', function (){
  var actual = encaseP(function (){ return Promise.reject(error) })(1);
  return assertRejected(actual, error);
});

test('ensures no resolution happens after cancel', function (done){
  var actual = encaseP(function (x){ return Promise.resolve(x + 1) })(1);
  actual._interpret(done, failRej, failRes)();
  setTimeout(done, 20);
});

test('ensures no rejection happens after cancel', function (done){
  var actual = encaseP(function (x){ return Promise.reject(x + 1) })(1);
  actual._interpret(done, failRej, failRes)();
  setTimeout(done, 20);
});

test('returns the code to create the Future when cast to String', function (){
  var f = function (a){ return Promise.resolve(a) };
  var m = encaseP(f)(null);
  expect(m.toString()).to.equal('encaseP (' + f.toString() + ') (null)');
});
