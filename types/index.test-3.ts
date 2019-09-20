import {
  reject3,
  fold3,
  resolve3,
  chain3,
} from "fluture";

// $ExpectType FutureInstance<never, number>
fold3((x: number) => x)((x: string) => x.length)(chain3(x => resolve3(`${x}!`))(reject3(42)));
