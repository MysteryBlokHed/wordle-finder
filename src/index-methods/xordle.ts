import { decompress } from '../lists'

const WORDLIST = decompress(
  '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',
) as unknown as [string, string][]

const UNLIMITED_WORDLIST = decompress(
  'N4IgjGBMAMIFwG0QFMCGA3ZBnEAaEARgJYA2JAniALr5gDMALLIiAOZGYB2eIAxqgBdeAC2q0ArOOZIAJkXYCenZAA8ArjhogY4sPFlEAthR5pWyAE5jt0AGx6WqYjOQ8swtZ0VbITB0iwiZHMeVBIAB2FUa0hdfxAAMyJOER4SVAt0aJ8AdgZ41ENwk3wiOQB7b3xIAA57fRAAd3KLAVF8YtReVy06X0gGgCtyskp8LABHNUFrOikBlmEiIXaQGXLOFtnxBgWA5I0eC2QEy2s/OgbDcsNDMbYLVCxw84hLlkMDnHwSZEwSc6QWzvAKGMIAjrIAQCShaBh0egNCxqX5WfCNZKpOGMEEgdCVM7jUgAa1h+HhAE5cTDkqw3JY1IZzrtcWENq5xgIiLxiecKYiWGhMN9EsjltZJDUGA0sNdSTwCMdUDIJTkwNKWAR0gAvDkgAQWbm8rTiOoapCGRl3HjCZBkcoSmp5GXCFqKfCodi/ay2HbiBpTAlucIZY34WwUhj+li8cqx6L4JKWMkgHLQOwNVThO08LmsYRVVOQOi2GVyvWe2nWHIU2ylxbLVL4AgokJaKk1GoNdAcMqhQwEM7t2zQLuOEjlBLuthqbCafC1hhjpDhIjZtEgSbTQsUuoUhpJEhtUwuMHUAC+QA==',
) as unknown as Record<number, [string, string]>

const RANDOM_WORDS = decompress(
  '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',
)

/**
 * Get a generator to index the unlimited wordbank
 * @param startingSeed The initial seed (plus any relevant modifier)
 * @returns A generator function that returns a random number
 */
function getGenerator(startingSeed: number) {
  let seed = Number(startingSeed)

  return function generator() {
    let newSeed = (seed += 1831565813)
    newSeed = Math.imul(newSeed ^ (newSeed >>> 15), 1 | newSeed)

    return (
      (((newSeed ^=
        newSeed + Math.imul(newSeed ^ (newSeed >>> 7), 61 | newSeed)) ^
        (newSeed >>> 14)) >>>
        0) /
      4294967296
    )
  }
}

/** Get a word for unlimited mode */
function getUnlimitedWord(rand: () => number) {
  return RANDOM_WORDS[Math.floor(RANDOM_WORDS.length * rand())]
}

/**
 * Checks whether two words are overlapping
 * @param word1 The first potential word
 * @param word2 The second potential word
 * @returns Whether the first two words share any characters
 */
function overlapping(word1: string, word2: string) {
  if (word1 === word2) return true
  if (word1.includes('*') || word2.includes('*')) return true
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] === word2[i]) return true
    if (word1.includes(word2[i])) return true
  }
  return false
}

export default function xordle(seed: number): [string, string] {
  if (seed in WORDLIST) return WORDLIST[seed]
  if (seed in UNLIMITED_WORDLIST) return UNLIMITED_WORDLIST[seed]

  const generator = getGenerator(seed + 100_000)

  let words: [string, string]

  do {
    words = [getUnlimitedWord(generator), getUnlimitedWord(generator)]
  } while (overlapping(...words))

  return words
}
