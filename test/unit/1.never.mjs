import {never} from '../../index.mjs';
import {assertValidFuture, noop, eq, test} from '../util/util.mjs';

test('is a Future', function (){
  assertValidFuture(never);
});

test('does nothing and returns a noop cancel function', function (){
  var m = never;
  var cancel = m._interpret(noop, noop, noop);
  cancel();
});

test('returns the code to create the Never', function (){
  var m = never;
  eq(m.toString(), 'never');
});
