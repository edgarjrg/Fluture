import FL from 'fantasy-laws';
import Z from 'sanctuary-type-classes';
import show from 'sanctuary-show';
import {Future, bimap} from '../../index.mjs';
import {assertEqual as eq, I, B, T, K, noop, STACKSIZE, test} from '../util/util.mjs';
import {
  FutureArb,
  _of,
  any as _x,
  anyFuture as _mx,
  constant as _k,
  elements,
  f,
  g,
  nat,
  property,
  suchthat,
} from '../util/props.mjs';

var of = function (x){
  return Z.of(Future, x);
};

var _f = elements([f, g, I, of]);
var _mf = _of(_f);
var _fm = FutureArb(_f, _f).smap(function (m){
  return function (x){
    return bimap(T(x))(T(x))(m);
  };
}, function (f){
  return bimap(K)(K)(f());
}, show);

function testLaw (laws, typeclass, name){
  var args = Array.from(arguments).slice(3);
  test(`${typeclass} ${name}`, laws[name].apply(null, args));
}

testLaw(FL.Functor(eq), 'Functor', 'identity', _mx);
testLaw(FL.Functor(eq), 'Functor', 'composition', _mx, _f, _f);

testLaw(FL.Alt(eq), 'Alt', 'associativity', _mx, _mx, _mx);
testLaw(FL.Alt(eq), 'Alt', 'distributivity', _mx, _mx, _f);

testLaw(FL.Bifunctor(eq), 'Bifunctor', 'identity', _mx);
testLaw(FL.Bifunctor(eq), 'Bifunctor', 'composition', _mx, _f, _f, _f, _f);

testLaw(FL.Apply(eq), 'Apply', 'composition', _mf, _mf, _mx);

testLaw(FL.Applicative(eq, Future), 'Applicative', 'identity', _mx);
testLaw(FL.Applicative(eq, Future), 'Applicative', 'homomorphism', _f, _x);
testLaw(FL.Applicative(eq, Future), 'Applicative', 'interchange', _mf, _x);

testLaw(FL.Chain(eq), 'Chain', 'associativity', _mx, _fm, _fm);

testLaw(
  FL.ChainRec(eq, Future),
  'ChainRec',
  'equivalence',
  _k(function (v){ return v < 1 }),
  _k(B(of)(function (v){ return v - 1 })),
  _k(of),
  suchthat(nat, function (x){ return x < 100 })
);

test('ChainRec stack-safety', function (){
  var p = function (v){ return v > (STACKSIZE + 1) };
  var d = of;
  var n = B(of)(function (v){ return v + 1 });
  var a = Z.chainRec(Future, function (l, r, v){ return p(v) ? Z.map(r, d(v)) : Z.map(l, n(v)) }, 0);
  a._interpret(noop, noop, noop);
});

testLaw(FL.Monad(eq, Future), 'Monad', 'leftIdentity', _fm, _mx);
testLaw(FL.Monad(eq, Future), 'Monad', 'rightIdentity', _mx);

property('map derived from ap and of', _mx, _f, function (m, f){
  return eq(Z.map(f, m), Z.ap(of(f), m));
});

property('map derived from chain and of', _mx, _f, function (m, f){
  return eq(Z.map(f, m), Z.chain(B(of)(f), m));
});

property('map derived from bimap', _mx, _f, function (m, f){
  return eq(Z.map(f, m), Z.bimap(I, f, m));
});

property('ap derived from chain and map', _mx, _mf, function (mx, mf){
  return eq(Z.ap(mf, mx), Z.chain(function (f){ return Z.map(f, mx) }, mf));
});
