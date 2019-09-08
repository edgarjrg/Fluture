import {resolve} from '../../index.mjs';
import {eq, assertValidFuture, assertResolved, test} from '../util/util.mjs';
import {testFunction, anyArg} from '../util/props.mjs';

testFunction('resolve', resolve, [anyArg], assertValidFuture);

test('returns a resolved Future', function (){
  return assertResolved(resolve(1), 1);
});

test('provides its reason to extractRight()', function (){
  eq(resolve(1).extractRight(), [1]);
});

test('can be shown as string', function (){
  eq(resolve(1).toString(), 'resolve (1)');
});
