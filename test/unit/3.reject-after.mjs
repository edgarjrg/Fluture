import {rejectAfter, never} from '../../index.mjs';
import {eq, assertValidFuture, assertRejected, failRej, failRes, test} from '../util/util.mjs';
import {testFunction, positiveIntegerArg, anyArg} from '../util/props.mjs';

testFunction('rejectAfter', rejectAfter, [positiveIntegerArg, anyArg], assertValidFuture);

test('returns Never when given Infinity', function (){
  eq(rejectAfter(Infinity)(1), never);
});

test('rejects with the given value', function (){
  return assertRejected(rejectAfter(20)(1), 1);
});

test('clears its internal timeout when cancelled', function (done){
  rejectAfter(20)(1)._interpret(done, failRej, failRes)();
  setTimeout(done, 25);
});

test('returns array with the value', function (){
  eq(rejectAfter(20)(1).extractLeft(), [1]);
});

test('returns the code to create the After when cast to String', function (){
  eq(rejectAfter(20)(1).toString(), 'rejectAfter (20) (1)');
});
