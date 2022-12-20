/*
 * This code has been modified from the source of <https://www.quordle.com>
 * and is NOT licensed under AGPL-3.0
 *
 * I'm not sure if the original class was from some JS library or written specifically for Quordle,
 * but I couldn't find anything like it while searching online
 */

/** A partial version of the random class used by Quordle */
export default class OS {
  N: number
  M: number
  MATRIX_A: number
  UPPER_MASK: number
  LOWER_MASK: number
  mt: number[]
  mti: number

  /**
   * @param seed The seed to use. Defaults to epoch milliseconds
   */
  constructor(seed?: number | number[] | null) {
    seed == null && (seed = new Date().getTime()),
      (this.N = 624),
      (this.M = 397),
      (this.MATRIX_A = 2567483615),
      (this.UPPER_MASK = 2147483648),
      (this.LOWER_MASK = 2147483647),
      (this.mt = new Array(this.N)),
      (this.mti = this.N + 1),
      seed.constructor == Array
        ? this.init_by_array(seed, seed.length)
        : this.init_seed(seed as number)
  }

  init_seed(seed: number) {
    for (this.mt[0] = seed >>> 0, this.mti = 1; this.mti < this.N; this.mti++) {
      var seed = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)
      ;(this.mt[this.mti] =
        ((((seed & 4294901760) >>> 16) * 1812433253) << 16) +
        (seed & 65535) * 1812433253 +
        this.mti),
        (this.mt[this.mti] >>>= 0)
    }
  }

  init_by_array(seed: number[], length: number) {
    var r, n, o
    for (
      this.init_seed(19650218),
        r = 1,
        n = 0,
        o = this.N > length ? this.N : length;
      o;
      o--
    ) {
      var i = this.mt[r - 1] ^ (this.mt[r - 1] >>> 30)
      ;(this.mt[r] =
        (this.mt[r] ^
          (((((i & 4294901760) >>> 16) * 1664525) << 16) +
            (i & 65535) * 1664525)) +
        seed[n] +
        n),
        (this.mt[r] >>>= 0),
        r++,
        n++,
        r >= this.N && ((this.mt[0] = this.mt[this.N - 1]), (r = 1)),
        n >= length && (n = 0)
    }
  }

  random_int() {
    var e,
      t = new Array(0, this.MATRIX_A)
    if (this.mti >= this.N) {
      var r
      for (
        this.mti == this.N + 1 && this.init_seed(5489), r = 0;
        r < this.N - this.M;
        r++
      )
        (e =
          (this.mt[r] & this.UPPER_MASK) | (this.mt[r + 1] & this.LOWER_MASK)),
          (this.mt[r] = this.mt[r + this.M] ^ (e >>> 1) ^ t[e & 1])
      for (; r < this.N - 1; r++)
        (e =
          (this.mt[r] & this.UPPER_MASK) | (this.mt[r + 1] & this.LOWER_MASK)),
          (this.mt[r] = this.mt[r + (this.M - this.N)] ^ (e >>> 1) ^ t[e & 1])
      ;(e =
        (this.mt[this.N - 1] & this.UPPER_MASK) |
        (this.mt[0] & this.LOWER_MASK)),
        (this.mt[this.N - 1] = this.mt[this.M - 1] ^ (e >>> 1) ^ t[e & 1]),
        (this.mti = 0)
    }
    return (
      (e = this.mt[this.mti++]),
      (e ^= e >>> 11),
      (e ^= (e << 7) & 2636928640),
      (e ^= (e << 15) & 4022730752),
      (e ^= e >>> 18),
      e >>> 0
    )
  }

  random_int31() {
    return this.random_int() >>> 1
  }
}

export const quordleBlacklist = new Set([
  'ABORT',
  'AGORA',
  'ALIEN',
  'ARMOR',
  'ARROW',
  'ARSON',
  'BLADE',
  'BLEED',
  'BLITZ',
  'BLOOD',
  'BOOBY',
  'BOOTY',
  'BOSOM',
  'BROAD',
  'BUTCH',
  'BUXOM',
  'CHICK',
  'CIGAR',
  'CRAZY',
  'DEATH',
  'DRONE',
  'DUMMY',
  'DWARF',
  'DYING',
  'ECLAT',
  'EKING',
  'ENDUE',
  'ENEMA',
  'FAIRY',
  'FANNY',
  'FATAL',
  'FATTY',
  'FECAL',
  'FETAL',
  'FETUS',
  'GASSY',
  'GAYER',
  'GAYLY',
  'GIPSY',
  'GONAD',
  'GROPE',
  'GYPSY',
  'HAREM',
  'HORNY',
  'HUSSY',
  'HYMEN',
  'IDIOT',
  'JUNTA',
  'JUNTO',
  'KNIFE',
  'LEPER',
  'LYNCH',
  'MAFIA',
  'MAMMY',
  'MORON',
  'OBESE',
  'OVARY',
  'OVATE',
  'PADDY',
  'PALSY',
  'PANSY',
  'PIGGY',
  'PRICK',
  'PUDGY',
  'PYGMY',
  'QUEER',
  'RANDY',
  'REARM',
  'RIFLE',
  'ROGER',
  'SALVO',
  'SCREE',
  'SCREW',
  'SEMEN',
  'SEPIA',
  'SHAFT',
  'SHANK',
  'SHOOT',
  'SHREW',
  'SIEGE',
  'SISSY',
  'SKIRT',
  'SLASH',
  'SLAVE',
  'SLOPE',
  'SNUFF',
  'SPADE',
  'SPANK',
  'SPEND',
  'SPENT',
  'SPERM',
  'SPLIT',
  'SPOOK',
  'SPUNK',
  'SWISH',
  'TAINT',
  'TRUMP',
  'UNTIL',
  'URINE',
  'VIXEN',
  'WASTE',
  'WELCH',
  'WELSH',
  'WENCH',
  'WILLY',
  'WITCH',
  'WOODY',
  'ZONAL',
])
