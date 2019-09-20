import { pipe as rpipe } from "ramda";

import {
  reject,
  reject4,
  fold,
  fold3,
  resolve,
  resolve4,
  chain,
  chain4,
  FutureInstance,
} from "fluture";

reject(null); // $ExpectType FutureInstance<null, unknown>
reject(null); // $ExpectType FutureInstance<null, unknown>

// $ExpectType FutureInstance<number, number>
fold((x: number) => x)((x: string) => x.length)(chain(x => resolve(`${x}!`))(reject(42)));

function test01(): FutureInstance<null, number> {
  const r = rpipe(//                                    $ExpectType FutureInstance<null, never> some other stuff
    () => reject(42), //                                $ExpectType () => FutureInstance<number, never>
    chain(x => resolve(`${x}!`)), //                    $ExpectType <LA>(source: FutureInstance<LA, never>) => FutureInstance<LA, string>
    fold((x: number) => x)((x: string) => x.length), // $ExpectType (source: FutureInstance<number, string>) => FutureInstance<never, number>
    chain(_ => reject(null)), //                        $ExpectType <LA>(source: FutureInstance<LA, number>) => FutureInstance<LA | null, never>
  )()

  return r
}

// $ExpectType FutureInstance<never, number>
fold3((x: number) => x)((x: string) => x.length)(chain4(x => resolve4(`${x}!`))(reject4(42)));