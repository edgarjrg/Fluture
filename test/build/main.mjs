import {noop, eq, test} from '../util/util.mjs';
import * as Fluture from '../../index.mjs';
import require from './require.mjs';

const Future = require('../../cjs.js');

test('exports the Future constructor by default', function (){
  eq(typeof Future, 'function');
  eq(Future(noop) instanceof Future, true);
});

test('has a Future property that refers to itself for import destructuring', function (){
  eq(Future.Future, Future);
});

Object.keys(Fluture).forEach(key => {
  test('has a ' + key + ' property of type ' + typeof Fluture[key], function (){
    eq(typeof Future[key], typeof Fluture[key]);
  });
});

test('exports Future with the correct name property', function (){
  eq(Future.name, Fluture.Future.name);
});
