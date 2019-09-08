import chai from 'chai';
import {resolve, after, reject} from '../../index.mjs';
import {chainRec} from '../../src/future.mjs';
import {isIteration} from '../../src/internal/iteration.mjs';
import {test, assertCrashed, assertRejected, assertResolved, error, failRej, failRes, noop} from '../util/util.mjs';

var expect = chai.expect;

test('is a binary function', function (){
  expect(chainRec).to.be.a('function');
  expect(chainRec.length).to.equal(2);
});

test('crashes if the iterator throws', function (){
  var m = chainRec(function (){ throw error });
  return assertCrashed(m, error);
});

test('does not break if the iteration does not contain a value key', function (){
  var actual = chainRec(function (f, g, x){ return (x, resolve({done: true})) }, 0);
  return assertResolved(actual, undefined);
});

test('calls the function with Next, Done and the initial value', function (){
  chainRec(function (next, done, x){
    expect(next).to.be.a('function');
    expect(next.length).to.equal(1);
    expect(next(x)).to.satisfy(isIteration);
    expect(done).to.be.a('function');
    expect(done.length).to.equal(1);
    expect(done(x)).to.satisfy(isIteration);
    expect(x).to.equal(42);
    return resolve(done(x));
  }, 42)._interpret(noop, noop, noop);
});

test('calls the function with the value from the current iteration', function (){
  var i = 0;
  chainRec(function (f, g, x){
    expect(x).to.equal(i);
    return x < 5 ? resolve(f(++i)) : resolve(g(x));
  }, i)._interpret(noop, noop, noop);
});

test('works asynchronously', function (){
  var actual = chainRec(function (f, g, x){ return after(10)(x < 5 ? f(x + 1) : g(x)) }, 0);
  return assertResolved(actual, 5);
});

test('responds to failure', function (){
  var m = chainRec(function (f, g, x){ return reject(x) }, 1);
  return assertRejected(m, 1);
});

test('responds to failure after chaining async', function (){
  var m = chainRec(
    function (f, g, x){ return x < 2 ? after(10)(f(x + 1)) : reject(x) }, 0
  );
  return assertRejected(m, 2);
});

test('can be cancelled straight away', function (done){
  chainRec(function (f, g, x){ return after(10)(g(x)) }, 1)
  ._interpret(done, failRej, failRes)();
  setTimeout(done, 20);
});

test('can be cancelled after some iterations', function (done){
  var m = chainRec(function (f, g, x){ return after(10)(x < 5 ? f(x + 1) : g(x)) }, 0);
  var cancel = m._interpret(done, failRej, failRes);
  setTimeout(cancel, 25);
  setTimeout(done, 70);
});
