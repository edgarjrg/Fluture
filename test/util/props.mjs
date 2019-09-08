import type from 'sanctuary-type-identifiers';
import show from 'sanctuary-show';
import jsc from 'jsverify';

import {Future, resolve, reject, Par, seq} from '../../index.mjs';
import {eq, error, throws, test} from '../util/util.mjs';
import {ordinal} from '../../src/internal/const.mjs';

export var array = jsc.array;
export var nearray = jsc.nearray;
export var bool = jsc.bool;
export var constant = jsc.constant;
export var falsy = jsc.falsy;
export var fn = jsc.fn;
export var letrec = jsc.letrec;
export var nat = jsc.nat;
export var number = jsc.number;
export var oneof = jsc.oneof;
export var string = jsc.string;
export var elements = jsc.elements;
export var suchthat = jsc.suchthat;
export var nil = elements([null, undefined]);

export function property (name){
  const args = Array.from(arguments).slice(1);
  test(name, () => {
    return jsc.assert(jsc.forall.apply(null, args));
  });
}

export function f (x){
  return {f: x};
}

export function g (x){
  return {g: x};
}

function value (m){
  return m._value;
}

function immediatelyResolve (x){
  var m = Future(function (rej, res){ setImmediate(res, x) });
  m._value = x;
  return m;
}

function immediatelyReject (x){
  var m = Future(function (rej){ setImmediate(rej, x) });
  m._value = x;
  return m;
}

export function AsyncResolvedFutureArb (arb){
  return arb.smap(immediatelyResolve, value, show);
}

export function AsyncRejectedFutureArb (arb){
  return arb.smap(immediatelyReject, value, show);
}

export function ResolvedFutureArb (arb){
  return arb.smap(resolve, value, show);
}

export function RejectedFutureArb (arb){
  return arb.smap(reject, value, show);
}

export function FutureArb (larb, rarb){
  return oneof(
    RejectedFutureArb(larb),
    ResolvedFutureArb(rarb),
    AsyncRejectedFutureArb(larb),
    AsyncResolvedFutureArb(rarb)
  );
}

export function _of (rarb){
  return FutureArb(string, rarb);
}

export var {
  any,
  anyFuture,
  anyRejectedFuture,
  anyResolvedFuture,
  anyNonFuture,
  anyFunction,
} = letrec(function (tie){
  return {
    anyRejectedFuture: oneof(AsyncRejectedFutureArb(tie('any')), RejectedFutureArb(tie('any'))),
    anyResolvedFuture: oneof(AsyncResolvedFutureArb(tie('any')), ResolvedFutureArb(tie('any'))),
    anyFuture: oneof(tie('anyRejectedFuture'), tie('anyResolvedFuture')),
    anyFunction: fn(tie('any')),
    anyNonFuture: oneof(
      number,
      string,
      bool,
      nil,
      constant(error),
      tie('anyFunction')
    ),
    any: oneof(
      tie('anyNonFuture'),
      tie('anyFuture')
    )
  };
});

export var anyParallel = anyFuture.smap(Par, seq, show);

export var altArg = {
  name: 'have Alt implemented',
  valid: anyFuture,
  invalid: anyNonFuture,
};

export var applyArg = {
  name: 'have Apply implemented',
  valid: anyFuture,
  invalid: anyNonFuture,
};

export var bifunctorArg = {
  name: 'have Bifunctor implemented',
  valid: anyFuture,
  invalid: anyNonFuture,
};

export var chainArg = {
  name: 'have Chain implemented',
  valid: anyFuture,
  invalid: anyNonFuture,
};

export var functorArg = {
  name: 'have Functor implemented',
  valid: anyFuture,
  invalid: anyNonFuture,
};

export var functionArg = {
  name: 'be a Function',
  valid: anyFunction,
  invalid: oneof(number, string, bool, falsy, constant(error)),
};

export var futureArg = {
  name: 'be a valid Future',
  valid: anyFuture,
  invalid: anyNonFuture,
};

export var resolvedFutureArg = {
  name: 'be a valid Future',
  valid: anyResolvedFuture,
  invalid: anyNonFuture,
};

export var positiveIntegerArg = {
  name: 'be a positive Integer',
  valid: suchthat(nat, function (x){ return x > 0 }),
  invalid: oneof(bool, constant(0.5)),
};

export var futureArrayArg = {
  name: 'be an Array of valid Futures',
  valid: array(anyFuture),
  invalid: oneof(nearray(anyNonFuture), any),
};

export var parallelArg = {
  name: 'be a ConcurrentFuture',
  valid: anyParallel,
  invalid: any,
};

export var anyArg = {
  name: 'be anything',
  valid: any,
  invalid: null,
};

var getValid = function (x){ return x.valid };
var generateValid = function (x){ return getValid(x).generator(1) };

var capply = function (f, args){
  return args.reduce(function (g, x){ return g(x) }, f);
};

export function testFunction (name, func, args, assert){
  var validArbs = args.map(getValid);
  var validArgs = args.map(generateValid);

  test('is a curried ' + args.length + '-ary function', function (){
    eq(typeof func, 'function');
    eq(func.length, 1);
    validArgs.slice(0, -1).forEach(function (_, idx){
      var partial = capply(func, validArgs.slice(0, idx + 1));
      eq(typeof partial, 'function');
      eq(partial.length, 1);
    });
  });

  args.forEach(function (arg, idx){
    var priorArgs = args.slice(0, idx);
    var followingArgs = args.slice(idx + 1);
    var validPriorArgs = priorArgs.map(generateValid);
    var validFollowingArgs = followingArgs.map(generateValid);
    if(arg !== anyArg){
      property('throws when the ' + ordinal[idx] + ' argument is invalid', arg.invalid, function (value){
        throws(function (){
          capply(func, validPriorArgs.concat([value]).concat(validFollowingArgs));
        }, new TypeError(
          name + '() expects its ' + ordinal[idx] + ' argument to ' + arg.name + '.\n' +
          '  Actual: ' + show(value) + ' :: ' + type.parse(type(value)).name
        ));
        return true;
      });
      property('throws when the ' + ordinal[idx] + ' invocation has more than one argument', arg.valid, function (value){
        throws(function (){
          var partial = capply(func, validPriorArgs);
          partial(value, 42);
        }, new TypeError(
          name + '() expects to be called with a single argument per invocation\n' +
          '  Saw: 2 arguments\n' +
          '  First: ' + show(value) + ' :: ' + type.parse(type(value)).name + '\n' +
          '  Second: 42 :: Number'
        ));
        return true;
      });
    }
  });

  property.apply(null, ['returns valid output when given valid input'].concat(validArbs).concat([function (){
    return assert(capply(func, Array.from(arguments)));
  }]));
}
