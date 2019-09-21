declare module 'fluture' {

  export interface RecoverFunction {
    (exception: Error): void
  }

  export interface RejectFunction<L> {
    (error: L): void
  }

  export interface ResolveFunction<R> {
    (value: R): void
  }

  export interface Cancel {
    (): void
  }

  export interface Nodeback<E, R> {
    (err: E | null, value?: R): void
  }

  export interface Next<T> {
    done: boolean
    value: T
  }

  export interface Done<T> {
    done: boolean
    value: T
  }

  export interface Iterator<N, D> {
    next(value?: N): Next<N> | Done<D>
  }

  export interface Generator<Y, R> {
    (): Iterator<Y, R>
  }

  export interface ConcurrentFutureInstance<L, R> {
    sequential: Future<L, R>
    'fantasy-land/ap'<A, B>(this: ConcurrentFutureInstance<L, (value: A) => B>, right: ConcurrentFutureInstance<L, A>): ConcurrentFutureInstance<L, B>
    'fantasy-land/map'<RB>(mapper: (value: R) => RB): ConcurrentFutureInstance<L, RB>
    'fantasy-land/alt'(right: ConcurrentFutureInstance<L, R>): ConcurrentFutureInstance<L, R>
  }

  export interface Future<L, R> {

    /** The Future constructor */
    constructor: FutureTypeRep

    /** Apply a function to this Future. See https://github.com/fluture-js/Fluture#pipe */
    pipe<T>(fn: (future: Future<L, R>) => T): T

    /** Attempt to extract the rejection reason. See https://github.com/fluture-js/Fluture#extractleft */
    extractLeft(): Array<L>

    /** Attempt to extract the resolution value. See https://github.com/fluture-js/Fluture#extractright */
    extractRight(): Array<R>

    'fantasy-land/ap'<A, B>(this: Future<L, (value: A) => B>, right: Future<L, A>): Future<L, B>
    'fantasy-land/map'<RB>(mapper: (value: R) => RB): Future<L, RB>
    'fantasy-land/alt'(right: Future<L, R>): Future<L, R>
    'fantasy-land/bimap'<LB, RB>(lmapper: (reason: L) => LB, rmapper: (value: R) => RB): Future<LB, RB>
    'fantasy-land/chain'<RB>(mapper: (value: R) => Future<L, RB>): Future<L, RB>

  }

  /** Creates a Future which resolves after the given duration with the given value. See https://github.com/fluture-js/Fluture#after */
  export function after<L, R>(duration: number): (value: R) => Future<L, R>

  /** Logical and for Futures. See https://github.com/fluture-js/Fluture#and */
  export function and<L, R>(left: Future<L, R>): (right: Future<L, any>) => Future<L, R>

  /** Logical or for Futures. See https://github.com/fluture-js/Fluture#alt */
  export function alt<L, R>(left: Future<L, R>): (right: Future<L, R>) => Future<L, R>

  /** Race two ConcurrentFutures. See https://github.com/fluture-js/Fluture#alt */
  export function alt<L, R>(left: ConcurrentFutureInstance<L, R>): (right: ConcurrentFutureInstance<L, R>) => ConcurrentFutureInstance<L, R>

  /** Apply the function in the left Future to the value in the right Future. See https://github.com/fluture-js/Fluture#ap */
  export function ap<L, RA, RB>(value: Future<L, RA>): (apply: Future<L, (value: RA) => RB>) => Future<L, RB>

  /** Apply the function in the left ConcurrentFuture to the value in the right ConcurrentFuture. See https://github.com/fluture-js/Fluture#ap */
  export function ap<L, RA, RB>(value: ConcurrentFutureInstance<L, RA>): (apply: ConcurrentFutureInstance<L, (value: RA) => RB>) => ConcurrentFutureInstance<L, RB>

  /** Create a Future which resolves with the return value of the given function, or rejects with the error it throws. See https://github.com/fluture-js/Fluture#attempt */
  export function attempt<L, R>(fn: () => R): Future<L, R>

  /** Convert a Promise-returning function to a Future. See https://github.com/fluture-js/Fluture#attemptP */
  export function attemptP<L, R>(fn: () => Promise<R>): Future<L, R>

  /** Map over both branched of the given Bifunctor at once. See https://github.com/fluture-js/Fluture#bimap */
  export function bimap<LA, LB>(lmapper: (reason: LA) => LB): <RA, RB>(rmapper: (value: RA) => RB) => (source: Future<LA, RA>) => Future<LB, RB>

  /** Wait for both Futures to resolve in parallel. See https://github.com/fluture-js/Fluture#both */
  export function both<L, A, B>(left: Future<L, A>): (right: Future<L, B>) => Future<L, [A, B]>

  /** Cache the outcome of the given Future. See https://github.com/fluture-js/Fluture#cache */
  export function cache<L, R>(source: Future<L, R>): Future<L, R>

  /** Create a Future using the resolution value of the given Future. See https://github.com/fluture-js/Fluture#chain */
  export function chain<L, RA, RB>(mapper: (value: RA) => Future<L, RB>): (source: Future<L, RA>) => Future<L, RB>

  /** Create a Future using the rejection reason of the given Future. See https://github.com/fluture-js/Fluture#chain */
  export function chainRej<LA, LB, R>(mapper: (reason: LA) => Future<LB, R>): (source: Future<LA, R>) => Future<LB, R>

  /** Fork the given Future into a Node-style callback. See https://github.com/fluture-js/Fluture#done */
  export function done<L, R>(callback: Nodeback<L, R>): (source: Future<L, R>) => Cancel

  /** Encase the given function such that it returns a Future of its return value. See https://github.com/fluture-js/Fluture#encase */
  export function encase<L, R, A>(fn: (a: A) => R): (a: A) => Future<L, R>

  /** Encase the given Promise-returning function such that it returns a Future of its resolution value. See https://github.com/fluture-js/Fluture#encasep */
  export function encaseP<L, R, A>(fn: (a: A) => Promise<R>): (a: A) => Future<L, R>

  /** Attempt to extract the rejection reason. See https://github.com/fluture-js/Fluture#extractleft */
  export function extractLeft<L, R>(source: Future<L, R>): Array<L>

  /** Attempt to extract the resolution value. See https://github.com/fluture-js/Fluture#extractright */
  export function extractRight<L, R>(source: Future<L, R>): Array<R>

  /** Fold both branches into the resolution branch. See https://github.com/fluture-js/Fluture#fold */
  export function fold<LA, LB, RB>(lmapper: (left: LA) => RB): <RA>(rmapper: (right: RA) => RB) => (source: Future<LA, RA>) => Future<LB, RB>

  /** Fork the given Future into the given continuations. See https://github.com/fluture-js/Fluture#fork */
  export function fork<L, R>(reject: RejectFunction<L>): (resolve: ResolveFunction<R>) => (source: Future<L, R>) => Cancel

  /** Fork with exception recovery. See https://github.com/fluture-js/Fluture#forkCatch */
  export function forkCatch<L, R>(recover: RecoverFunction): (reject: RejectFunction<L>) => (resolve: ResolveFunction<R>) => (source: Future<L, R>) => Cancel

  /** Build a coroutine using Futures. See https://github.com/fluture-js/Fluture#go */
  export function go<L, R>(generator: Generator<Future<L, any>, R>): Future<L, R>

  /** Manage resources before and after the computation that needs them. See https://github.com/fluture-js/Fluture#hook */
  export function hook<L, H, R>(acquire: Future<L, H>): (dispose: (handle: H) => Future<any, any>) => (consume: (handle: H) => Future<L, R>) => Future<L, R>

  /** Returns true for Futures. See https://github.com/fluture-js/Fluture#isfuture */
  export function isFuture(value: any): boolean

  /** Returns true for Futures that will certainly never settle. See https://github.com/fluture-js/Fluture#isnever */
  export function isNever(value: any): boolean

  /** Set up a cleanup Future to run after the given action has settled. See https://github.com/fluture-js/Fluture#lastly */
  export function lastly<L, R>(cleanup: Future<L, any>): (action: Future<L, R>) => Future<L, R>

  /** Map over the resolution value of the given Future. See https://github.com/fluture-js/Fluture#map */
  export function map<L, RA, RB>(mapper: (value: RA) => RB): (source: Future<L, RA>) => Future<L, RB>

  /** Map over the resolution value of the given ConcurrentFuture. See https://github.com/fluture-js/Fluture#map */
  export function map<L, RA, RB>(mapper: (value: RA) => RB): (source: ConcurrentFutureInstance<L, RA>) => ConcurrentFutureInstance<L, RB>

  /** Map over the rejection reason of the given Future. See https://github.com/fluture-js/Fluture#maprej */
  export function mapRej<LA, LB, R>(mapper: (reason: LA) => LB): (source: Future<LA, R>) => Future<LB, R>

  /** A Future that never settles. See https://github.com/fluture-js/Fluture#never */
  export var never: Future<never, never>

  /** Create a Future using a provided Node-style callback. See https://github.com/fluture-js/Fluture#node */
  export function node<L, R>(fn: (done: Nodeback<L, R>) => void): Future<L, R>

  /** Create a Future with the given resolution value. See https://github.com/fluture-js/Fluture#of */
  export function resolve<L, R>(value: R): Future<L, R>

  /** Run an Array of Futures in parallel, under the given concurrency limit. See https://github.com/fluture-js/Fluture#parallel */
  export function parallel<L, R>(concurrency: number): (futures: Array<Future<L, R>>) => Future<L, Array<R>>

  /** Convert a Future to a Promise. See https://github.com/fluture-js/Fluture#promise */
  export function promise<R>(source: Future<Error, R>): Promise<R>

  /** Race two Futures against one another. See https://github.com/fluture-js/Fluture#race */
  export function race<L, R>(left: Future<L, R>): (right: Future<L, R>) => Future<L, R>

  /** Create a Future with the given rejection reason. See https://github.com/fluture-js/Fluture#reject */
  export function reject<L, R>(reason: L): Future<L, R>

  /** Creates a Future which rejects after the given duration with the given reason. See https://github.com/fluture-js/Fluture#rejectafter */
  export function rejectAfter<L, R>(duration: number): (reason: L) => Future<L, R>

  /** Convert a ConcurrentFuture to a regular Future. See https://github.com/fluture-js/Fluture#concurrentfuture */
  export function seq<L, R>(source: ConcurrentFutureInstance<L, R>): Future<L, R>

  /** Swap the rejection reason and the resolution value. See https://github.com/fluture-js/Fluture#swap */
  export function swap<L, R>(source: Future<L, R>): Future<R, L>

  /** Fork the Future into the given continuation. See https://github.com/fluture-js/Fluture#value */
  export function value<R>(resolve: ResolveFunction<R>): (source: Future<never, R>) => Cancel

  /** Enable or disable debug mode. See https://github.com/fluture-js/Fluture#debugmode */
  export function debugMode(debug: boolean): void;

  export interface FutureTypeRep {

    /** Create a Future from a possibly cancellable computation. See https://github.com/fluture-js/Fluture#future */
    <L, R>(computation: (
      reject: RejectFunction<L>,
      resolve: ResolveFunction<R>
    ) => Cancel | void): Future<L, R>

    'fantasy-land/chainRec'<L, I, R>(iterator: (next: (value: I) => Next<I>, done: (value: R) => Done<R>, value: I) => Future<L, Next<I> | Done<R>>, initial: I): Future<L, R>
    'fantasy-land/of': typeof resolve

    '@@type': string

  }

  export var Future: FutureTypeRep
  export default Future

  export interface ConcurrentFutureTypeRep {

    /** Create a ConcurrentFuture using a Future. See https://github.com/fluture-js/Fluture#concurrentfuture */
    <L, R>(source: Future<L, R>): ConcurrentFutureInstance<L, R>

    'fantasy-land/of'<L, R>(value: R): ConcurrentFutureInstance<L, R>
    'fantasy-land/zero'<L, R>(): ConcurrentFutureInstance<L, R>

    '@@type': string

  }

  export var Par: ConcurrentFutureTypeRep

}
