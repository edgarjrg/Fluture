import Either from 'sanctuary-either';
import {Future, alt} from '../../index.mjs';
import {assertCrashed, eq, assertValidFuture, noop, assertResolved, assertRejected, error, test} from '../util/util.mjs';
import {crashed, rejected, resolved, rejectedSlow, resolvedSlow} from '../util/futures.mjs';
import {testFunction, altArg, futureArg} from '../util/props.mjs';

testFunction('alt', alt, [altArg, futureArg], assertValidFuture);

test('chooses the resolved over the rejected Future', function (){
  return Promise.all([
    assertResolved(alt(crashed)(resolved), 'resolved'),
    assertResolved(alt(resolved)(resolved), 'resolved'),
    assertResolved(alt(rejected)(resolved), 'resolved'),
    assertResolved(alt(resolved)(rejected), 'resolved'),
    assertRejected(alt(rejected)(rejected), 'rejected'),
    assertResolved(alt(resolved)(resolvedSlow), 'resolvedSlow'),
    assertResolved(alt(resolvedSlow)(resolved), 'resolved'),
    assertRejected(alt(rejected)(rejectedSlow), 'rejected'),
    assertRejected(alt(rejectedSlow)(rejected), 'rejectedSlow'),
    assertCrashed(alt(rejected)(crashed), error),
    assertCrashed(alt(resolved)(crashed), error),
    assertCrashed(alt(crashed)(rejected), error),
  ]);
});

test('dispatches to Fantasy Land alt', function (){
  eq(alt(Either.Right(42))(Either.Left(42)), Either.Right(42));
});

test('cancels the running Future', function (done){
  var m = Future(function (){ return function (){ return done() } });
  var cancel = alt(m)(m)._interpret(done, noop, noop);
  cancel();
});

test('displays correctly as string', function (){
  eq(alt(rejected)(resolved).toString(), 'alt (reject ("rejected")) (resolve ("resolved"))');
});

