import {swap, resolve, reject} from '../../index.mjs';
import {test, assertRejected, assertResolved, assertValidFuture, eq} from '../util/util.mjs';
import {testFunction, futureArg} from '../util/props.mjs';

testFunction('swap', swap, [futureArg], assertValidFuture);

test('rejects with the resolution value', function (){
  var actual = swap(resolve(1));
  return assertRejected(actual, 1);
});

test('resolves with the rejection reason', function (){
  var actual = swap(reject(1));
  return assertResolved(actual, 1);
});

test('displays correctly as string', function (){
  eq(swap(resolve(42)).toString(), 'swap (resolve (42))');
});
