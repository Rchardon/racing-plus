import { copyMap } from "isaacscript-common";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";

// cspell:disable
const characterMap = new Map<string, PlayerType | PlayerTypeCustom>([
  ["isaac", 0],
  ["magdalene", 1],
  ["maggy", 1],
  ["cain", 2],
  ["judas", 3],
  ["bluebaby", 4],
  ["bb", 4],
  ["eve", 5],
  ["samson", 6],
  ["azazel", 7],
  ["lazarus", 8],
  ["laz", 8], // Needed so that "laz2" does not take precedence over "lazarus"
  ["eden", 9],
  ["thelost", 10],
  ["lost", 10],
  ["lazarus2", 11],
  ["laz2", 11],
  ["darkjudas", 12],
  ["djudas", 12],
  ["blackjudas", 12],
  ["bjudas", 12],
  ["lilith", 13],
  ["keeper", 14],
  ["apollyon", 15],
  ["theforgotten", 16],
  ["forgotten", 16],
  ["thesoul", 17],
  ["soul", 17],
  ["bethany", 18],
  ["jacob", 19],
  ["esau", 20],
  ["taintedisaac", 21],
  ["tisaac", 21],
  ["taintedmagdalene", 22],
  ["tmagdalene", 22],
  ["taintedmaggy", 22],
  ["tmaggy", 22],
  ["taintedcain", 23],
  ["tcain", 23],
  ["taintedjudas", 24],
  ["tjudas", 24],
  ["taintedbluebaby", 25],
  ["tbluebaby", 25],
  ["tbb", 25],
  ["taintedeve", 26],
  ["teve", 26],
  ["taintedsamson", 27],
  ["tsamson", 27],
  ["taintedazazel", 28],
  ["tazazel", 28],
  ["taintedlazarus", 29],
  ["tlazarus", 29],
  ["taintedlaz", 29],
  ["tlaz", 29],
  ["taintededen", 30],
  ["teden", 30],
  ["taintedlost", 31],
  ["tlost", 31],
  ["taintedlilith", 32],
  ["tlilith", 32],
  ["taintedkeeper", 33],
  ["tkeeper", 33],
  ["taintedapollyon", 34],
  ["tapollyon", 34],
  ["taintedforgotten", 34],
  ["tforgotten", 35],
  ["taintedbethany", 36],
  ["tbethany", 36],
  ["taintedjacob", 37],
  ["tjacob", 37],
  ["taintedlazarusdead", 38],
  ["tlazarusdead", 38],
  ["taintedlazdead", 38],
  ["tlazdead", 38],
  ["deadtaintedlazarus", 38],
  ["deadtlazarus", 38],
  ["deadtaintedlaz", 38],
  ["deadtlaz", 38],
  ["taintedjacobghost", 39],
  ["tjacobghost", 39],
  // 40 is Tainted Soul, which is the same as Tainted Forgotten
]);

const RANDOM_BABY_KEYS: readonly string[] = ["baby", "randombaby"];

if (PlayerTypeCustom.PLAYER_RANDOM_BABY !== -1) {
  for (const key of RANDOM_BABY_KEYS) {
    characterMap.set(key, PlayerTypeCustom.PLAYER_RANDOM_BABY);
  }
}

export const CHARACTER_MAP: ReadonlyMap<string, PlayerType | PlayerTypeCustom> =
  copyMap(characterMap);
