import chai from 'chai';
import {attempt, map} from '../../index.mjs';
import {test, assertCrashed, assertRejected, assertResolved, assertValidFuture, error} from '../util/util.mjs';
import {testFunction, functionArg} from '../util/props.mjs';

var expect = chai.expect;

testFunction('encase', attempt, [functionArg], assertValidFuture);

test('resolves with the return value of the function', function (){
  var actual = attempt(function (){ return 1 });
  return assertResolved(actual, 1);
});

test('rejects with the exception thrown by the function', function (){
  var actual = attempt(function (){ throw error });
  return assertRejected(actual, error);
});

test('does not swallow errors from subsequent maps and such', function (){
  var m = map(function (){ throw error })(attempt(function (x){ return x }));
  return assertCrashed(m, error);
});

test('returns the code to create the Future', function (){
  var f = function (){};
  var m = attempt(f);
  expect(m.toString()).to.equal('encase (' + f.toString() + ') (undefined)');
});
