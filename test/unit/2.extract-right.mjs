import {extractRight} from '../../index.mjs';
import {testFunction, futureArg} from '../util/props.mjs';
import {isArray, test} from '../util/util.mjs';
import {mock} from '../util/futures.mjs';

testFunction('extractRight', extractRight, [futureArg], isArray);

test('dispatches to #extractRight', function (done){
  var m = Object.create(mock);
  m.extractRight = done;
  extractRight(m);
});
