import { pipe as rpipe } from "ramda";
import { pipe as fPipe } from "fp-ts/lib/pipeable";
import {
  reject,
  reject3,
  reject4,
  reject6,
  fold,
  fold3,
  fold4,
  fold6,
  FutureInstance,
  resolve,
  resolve3,
  resolve4,
  resolve6,
  chain,
  chain3,
  chain5,
  chain6,
  chain7,
  ap,
  ap1,
  chainRej,
  chainRej7,
  chainRej6,
} from "fluture";

(() => {

  reject(42); // $ExpectType FutureInstance<number, unknown>
  reject(42); // $ExpectType FutureInstance<number, unknown>

  reject4(42); // $ExpectType FutureInstance<number, never>
})();

(() => {

  resolve(42); // $ExpectType FutureInstance<unknown, number>
  resolve(42); // $ExpectType FutureInstance<unknown, number>

  resolve4(42); // $ExpectType FutureInstance<never, number>
})();

(() => {

  //                                                       $ExpectType () => FutureInstance<null, number>
  function test0(): FutureInstance<null, number> {
    const r = fPipe(//                                     $ExpectType FutureInstance<null, never>
      reject4(42), //                                      $ExpectType FutureInstance<number, never>
      chain5((x: number) => resolve4(`${x}!`)), //                   $ExpectType <LA>(source: FutureInstance<LA, never>) => FutureInstance<LA, string>
      fold4((x: number) => x)((x: string) => x.length), // $ExpectType (source: FutureInstance<number, string>) => FutureInstance<never, number>
      chain5(_ => reject4(null)), //                       $ExpectType <LA>(source: FutureInstance<LA, number>) => FutureInstance<LA | null, never>
    )

    return r
  }

  //                                                       $ExpectType () => FutureInstance<null, number>
  function test01(): FutureInstance<null, number> {
    const r = rpipe(//                                     $ExpectType FutureInstance<null, never> some other stuff
      () => reject4(42), //                                $ExpectType () => FutureInstance<number, never>
      chain5(x => resolve4(`${x}!`)), //                   $ExpectType <LA>(source: FutureInstance<LA, never>) => FutureInstance<LA, string>
      fold4((x: number) => x)((x: string) => x.length), // $ExpectType (source: FutureInstance<number, string>) => FutureInstance<never, number>
      chain5(_ => reject4(null)), //                       $ExpectType <LA>(source: FutureInstance<LA, number>) => FutureInstance<LA | null, never>
    )()

    return r
  }
})();

(() => {

  // fails a lot
  //                                                            $ExpectType () => FutureInstance<string, number>
  (): FutureInstance<string, number> => {
    const r = fold((x: number) => x)((x: string) => x.length)// $ExpectType FutureInstance<never, number>
      (
        chain(//                                                $ExpectType FutureInstance<number, string>
          (x: number) => resolve(`${x}!`) //                    $ExpectType () => FutureInstance<never, string>
        )(
          reject(42) //                                         $ExpectType FutureInstance<number, never>
        )
      );

    return r
  }

  // work with explicit types
  //                                                                                     $ExpectType () => FutureInstance<string, number>
  (): FutureInstance<string, number> => {
    const r = fold<number, string, number>((x: number) => x)((x: string) => x.length) // $ExpectType FutureInstance<string, number>
      (
        chain<number, number, string>(//                                                 $ExpectType FutureInstance<number, string>
          (x: number) => resolve(`${x}!`) //                                             $ExpectType () => FutureInstance<never, string>
        )(
          reject<number, number>(42) //                                                  $ExpectType FutureInstance<number, never>
        )
      );

    return r
  }

  // 6 assigned unknown 
  //                                                              $ExpectType () => FutureInstance<string, number>
  (): FutureInstance<null, number> => {
    const r = chainRej6(() => reject6<null, number>(null))(
      fold6((x: number) => x)((x: string) => x.length) // $ExpectType FutureInstance<string, number>
        (
          chain6(//                                                 $ExpectType FutureInstance<number, string>
            (x: number) => resolve6<number, string>(`${x}!`) //     $ExpectType () => FutureInstance<never, string>
          )
            (
              reject6(42) //                                        $ExpectType FutureInstance<number, never>
            )
        )
    );

    return r
  }

  // 7 assigned unknown
  //                                                              $ExpectType () => FutureInstance<null, number>
  (): FutureInstance<null, number> => {
    const r = chainRej7(() => reject(null))(//                   $ExpectType FutureInstance<null, number>
      fold6((x: number) => x)((x: string) => x.length) //         $ExpectType FutureInstance<unknown, number>
        (
          chain7(//                                               $ExpectType FutureInstance<number, string>
            (x: number) => resolve6(`${x}!`) //                   $ExpectType () => FutureInstance<unknown, string>
          )
            (
              reject6(42) //                                      $ExpectType FutureInstance<number, unknown>
            )
        )
    );

    return r
  }

  // fails with *Type 'unknown' is not assignable to type 'number'.*
  //                                                             $ExpectType () => FutureInstance<string, number>
  (): FutureInstance<string, number> => {
    const r = fold3((x: number) => x)((x: string) => x.length)// $ExpectType FutureInstance<never, number>
      (
        chain3(//                                                $ExpectType FutureInstance<number, string>
          (x: number) => resolve3(`${x}!`) //                    $ExpectType () => FutureInstance<never, string>
        )(
          reject3(42) //                                         $ExpectType FutureInstance<number, never>
        )
      );

    return r
  }

  //                                                             $ExpectType () => FutureInstance<string, number>
  (): FutureInstance<string, number> => {
    const r = fold4((x: number) => x)((x: string) => x.length)// $ExpectType FutureInstance<never, number>
      (
        chain5(//                                                $ExpectType FutureInstance<number, string>
          (x: number) => resolve4(`${x}!`) //                    $ExpectType () => FutureInstance<never, string>
        )(
          reject4(42) //                                         $ExpectType FutureInstance<number, never>
        )
      );

    return r
  }
})();

(() => {
  // $ExpectType FutureInstance<unknown, number[]>
  resolve((x: number) => (y: number) => [x, y])
    .pipe(x => ap1(resolve(3))(x)) // $ExpectType <T>(fn: (future: FutureInstance<unknown, (x: number) => (y: number) => number[]>) => T) => T
    .pipe(x => ap1(resolve(3))(x)) // $ExpectType <T>(fn: (future: FutureInstance<unknown, (y: number) => number[]>) => T) => T

  // $ExpectType FutureInstance<never, number[]>
  resolve4((x: number) => (y: number) => [x, y])
    .pipe(x => ap1(resolve4(3))(x)) // $ExpectType <T>(fn: (future: FutureInstance<never, (x: number) => (y: number) => number[]>) => T) => T
    .pipe(x => ap1(resolve4(3))(x)) // $ExpectType <T>(fn: (future: FutureInstance<never, (y: number) => number[]>) => T) => T
})();
