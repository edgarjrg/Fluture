import {forkCatch} from '../../index.mjs';
import {testFunction, functionArg, futureArg} from '../util/props.mjs';
import {eq, isFunction, error, noop, test} from '../util/util.mjs';
import {crashed, rejected, resolved} from '../util/futures.mjs';

testFunction('forkCatch', forkCatch, [functionArg, functionArg, functionArg, futureArg], isFunction);

test('calls the first continuation with the crash exception', function (done){
  function assertCrash (x){
    eq(x, error);
    done();
  }
  forkCatch(assertCrash)(noop)(noop)(crashed);
});

test('calls the second continuation with the rejection reason', function (done){
  function assertRejection (x){
    eq(x, 'rejected');
    done();
  }
  forkCatch(noop)(assertRejection)(noop)(rejected);
});

test('calls the third continuation with the resolution value', function (done){
  function assertResolution (x){
    eq(x, 'resolved');
    done();
  }
  forkCatch(noop)(noop)(assertResolution)(resolved);
});
