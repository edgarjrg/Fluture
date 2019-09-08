import {promise} from '../../index.mjs';
import {testFunction, futureArg} from '../util/props.mjs';
import {noop, isThenable, eq, error, test} from '../util/util.mjs';
import {crashed, rejected, resolved} from '../util/futures.mjs';

process.addListener('unhandledRejection', noop);

testFunction('promise', promise, [futureArg], isThenable);

test('returns a Promise', function (){
  var actual = promise(resolved);
  eq(actual instanceof Promise, true);
});

test('rejects if the Future crashes', function (){
  return promise(crashed).then(
    function (){ throw new Error('It resolved') },
    function (x){ eq(x, error) }
  );
});

test('rejects if the Future rejects', function (){
  return promise(rejected).then(
    function (){ throw new Error('It resolved') },
    function (x){ eq(x, 'rejected') }
  );
});

test('resolves if the Future resolves', function (){
  return promise(resolved).then(
    function (x){ eq(x, 'resolved') }
  );
});
