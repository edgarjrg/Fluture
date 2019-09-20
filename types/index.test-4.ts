import { pipe as rpipe } from "ramda";
import { pipe as fPipe } from "fp-ts/lib/pipeable";
import {
  reject4,
  fold4,
  FutureInstance,
  resolve4,
  chain5,
  ap1,
} from "fluture";

reject4(null); // $ExpectType FutureInstance<null, never>

// $ExpectType () => FutureInstance<null, number>
function test0(): FutureInstance<null, number> {
  const r = fPipe(// $ExpectType FutureInstance<null, never>
    reject4(42),                                      // $ExpectType FutureInstance<number, never>
    chain5(x => resolve4(`${x}!`)),                   // $ExpectType <LA>(source: FutureInstance<LA, never>) => FutureInstance<LA, string>
    fold4((x: number) => x)((x: string) => x.length), // $ExpectType (source: FutureInstance<number, string>) => FutureInstance<never, number>
    chain5(_ => reject4(null)),                       // $ExpectType <LA>(source: FutureInstance<LA, number>) => FutureInstance<LA | null, never>
  )

  return r
}

// $ExpectType () => FutureInstance<null, number>
function test01(): FutureInstance<null, number> {
  const r = rpipe(//                                     $ExpectType FutureInstance<null, never> some other stuff
    () => reject4(42), //                                $ExpectType () => FutureInstance<number, never>
    chain5(x => resolve4(`${x}!`)), //                   $ExpectType <LA>(source: FutureInstance<LA, never>) => FutureInstance<LA, string>
    fold4((x: number) => x)((x: string) => x.length), // $ExpectType (source: FutureInstance<number, string>) => FutureInstance<never, number>
    chain5(_ => reject4(null)), //                       $ExpectType <LA>(source: FutureInstance<LA, number>) => FutureInstance<LA | null, never>
  )()

  return r
}

// $ExpectType FutureInstance<never, number>
fold4((x: number) => x)((x: string) => x.length)(chain5(x => resolve4(`${x}!`))(reject4(42)));

// $ExpectType () => FutureInstance<number, number>
function test1(): FutureInstance<number, number> {
  return fold4((x: number) => x)((x: string) => x.length)(chain5(x => resolve4(`${x}!`))(reject4(42)))
}

// $ExpectType FutureInstance<never, number[]>
resolve4((x: number) => (y: number) => [x, y])
  .pipe(x => ap1(resolve4(3))(x)) // $ExpectType <T>(fn: (future: FutureInstance<never, (x: number) => (y: number) => number[]>) => T) => T
  .pipe(x => ap1(resolve4(3))(x)) // $ExpectType <T>(fn: (future: FutureInstance<never, (y: number) => number[]>) => T) => T
