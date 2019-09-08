import {isFuture} from '../../index.mjs';
import {property, anyFuture, anyNonFuture} from '../util/props.mjs';

property('returns true about Futures', anyFuture, function (value){
  return isFuture(value) === true;
});

property('returns false about everything else', anyNonFuture, function (value){
  return isFuture(value) === false;
});
