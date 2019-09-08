import chai from 'chai';
import {encase, map} from '../../index.mjs';
import {test, assertCrashed, assertRejected, assertResolved, assertValidFuture, error} from '../util/util.mjs';
import {testFunction, functionArg, anyArg} from '../util/props.mjs';

var expect = chai.expect;

testFunction('encase', encase, [functionArg, anyArg], assertValidFuture);

test('resolves with the return value of the function', function (){
  var actual = encase(function (x){ return x + 1 })(1);
  return assertResolved(actual, 2);
});

test('rejects with the exception thrown by the function', function (){
  var actual = encase(function (a){ throw a, error })(1);
  return assertRejected(actual, error);
});

test('does not swallow errors from subsequent maps and such', function (){
  var m = map(function (){ throw error })(encase(function (x){ return x })(1));
  return assertCrashed(m, error);
});

test('returns the code to create the Future when cast to String', function (){
  var f = function (a){ return void a };
  var m = encase(f)(null);
  expect(m.toString()).to.equal('encase (' + f.toString() + ') (null)');
});
