import {isNever, never} from '../../index.mjs';
import {any, property} from '../util/props.mjs';
import {eq, test} from '../util/util.mjs';

test('returns true about never', function (){
  eq(isNever(never), true);
});

property('returns false about everything else', any, function (value){
  return isNever(value) === false;
});
