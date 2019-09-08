import {done} from '../../index.mjs';
import {testFunction, functionArg, resolvedFutureArg} from '../util/props.mjs';
import {eq, isFunction, test} from '../util/util.mjs';
import {rejected, resolved} from '../util/futures.mjs';

testFunction('done', done, [functionArg, resolvedFutureArg], isFunction);

test('passes the rejection value as first parameter', function (testDone){
  done(function (x, y){
    eq(x, 'rejected');
    eq(y, undefined);
    testDone();
  })(rejected);
});

test('passes the resolution value as second parameter', function (testDone){
  done(function (x, y){
    eq(x, null);
    eq(y, 'resolved');
    testDone();
  })(resolved);
});
