import show from 'sanctuary-show';
import {value} from '../../index.mjs';
import {testFunction, functionArg, resolvedFutureArg} from '../util/props.mjs';
import {eq, isFunction, noop, itRaises, error, test} from '../util/util.mjs';
import {crashed, rejected, resolved} from '../util/futures.mjs';

testFunction('value', value, [functionArg, resolvedFutureArg], isFunction);

itRaises('when the Future crashes', function (){
  value(noop)(rejected);
}, error);

itRaises('when the Future rejects', function (){
  value(noop)(crashed);
}, new Error(
  'Future#value was called on a rejected Future\n' +
  '  Rejection: "rejected"\n' +
  '  Future: ' + show(rejected)
));

test('calls the continuation with the resolution value', function (done){
  value(function (x){
    eq(x, 'resolved');
    done();
  })(resolved);
});
