import Either from 'sanctuary-either';
import {bimap} from '../../index.mjs';
import {test, assertCrashed, assertRejected, assertResolved, assertValidFuture, I, bang, eq, throwing, error} from '../util/util.mjs';
import {testFunction, functionArg, bifunctorArg} from '../util/props.mjs';
import {resolved, rejected} from '../util/futures.mjs';

testFunction('bimap', bimap, [functionArg, functionArg, bifunctorArg], assertValidFuture);

test('runs a bimap transformation on Futures', function (){
  return Promise.all([
    assertRejected(bimap(bang)(I)(rejected), 'rejected!'),
    assertResolved(bimap(I)(bang)(resolved), 'resolved!'),
    assertCrashed(bimap(throwing)(I)(rejected), error),
    assertCrashed(bimap(I)(throwing)(resolved), error),
  ]);
});

test('dispatches to Fantasy Land bimap otherwise', function (){
  eq(bimap(I)(bang)(Either.Right('hello')), Either.Right('hello!'));
});

test('displays correctly as string', function (){
  eq(bimap(I)(bang)(resolved).toString(), 'bimap (' + I.toString() + ') (' + bang.toString() + ') (resolve ("resolved"))');
});
