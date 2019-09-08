import {extractLeft} from '../../index.mjs';
import {testFunction, futureArg} from '../util/props.mjs';
import {isArray, test} from '../util/util.mjs';
import {mock} from '../util/futures.mjs';

testFunction('extractLeft', extractLeft, [futureArg], isArray);

test('dispatches to #extractLeft', function (done){
  var m = Object.create(mock);
  m.extractLeft = done;
  extractLeft(m);
});
