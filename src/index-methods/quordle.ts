/**
 * Wordle Finder - A site to add generic wordlists for Wordle-like games
 * and find solutions for a given date.
 * Copyright (C) 2022  Adam Thompson-Sharpe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import MersenneTwister from 'mersenne-twister'
import { decompress } from '../lists'

/**
 * Generate answers for Quordle or Octordle using the v1 method
 * @param seed The seed to use for the Mersenne Twister
 * @param wordCount The amount of words to generate (i.e. 4 for Quordle, 8 for Octordle)
 * @param wordlist The wordlist to use
 * @param blacklist The blacklist to use
 * @returns A list of answers, with the same length as `wordCount`
 */
export function v1Method(
  seed: number,
  wordCount: number,
  wordlist: readonly string[],
  blacklist: Set<string>,
) {
  let answers: string[]
  const totalWords = wordlist.length

  const rand = new MersenneTwister(seed)
  for (let i = 0; i < wordCount; i++) rand.random_int31()

  // Get new answers until they are all unique and none of them are in the blacklist
  do {
    const indices: number[] = []
    for (let i = 0; i < wordCount; i++) {
      indices.push(rand.random_int31() % totalWords)
    }
    answers = indices.map(index => wordlist[index])
  } while (
    // Ensure answers are unique
    wordCount !== new Set(answers).size ||
    // Ensure no answers are blacklisted
    answers.some(answer => blacklist.has(answer))
  )

  return answers
}

/**
 *
 * @param seed The seed to use
 * @param modifier An arbitrary modifier used against the seed
 * @param wordCount The amount of words to generate (will probably only ever be 8)
 * @param wordlist The wordlist to use
 * @param blacklist The blacklist to use
 * @returns A list of answers, with the same length as `wordCount`
 */
export function v2Method(
  seed: number,
  modifier: number,
  wordCount: number,
  wordlist: readonly string[],
  blacklist: Set<string>,
) {
  let v2Seed = Math.floor(seed / modifier)

  // Scramble wordbank
  const scrambledWords = [...wordlist]

  let len = scrambledWords.length
  let word: string
  let index: number

  while (len) {
    let sinSeed = Math.sin(v2Seed) * 10_000
    sinSeed = sinSeed - Math.floor(sinSeed)

    index = Math.floor(sinSeed * len--)
    word = scrambledWords[len]
    scrambledWords[len] = scrambledWords[index]
    scrambledWords[index] = word
    ++v2Seed
  }

  len = scrambledWords.length

  // Select answers
  let answers: string[]
  let offset = (seed * modifier) % len

  // Get new answers until they are all unique and none of them are in the blacklist
  do {
    const indices: number[] = []
    for (let i = 0; i < wordCount; i++) {
      indices.push(offset++ % len)
    }
    answers = indices.map(index => scrambledWords[index])
  } while (
    // Answers are unique
    wordCount !== new Set(answers).size ||
    // No answers blacklisted
    answers.some(answer => blacklist.has(answer))
  )

  return answers
}

/**
 * Generate the root seed used by Octordle
 * @param date The date to use for the seed
 * @returns The seed for Octordle
 */
export function octordleSeed(date: Date) {
  const someDate = new Date('01/24/2022')
  const someDateUTC = Date.UTC(
    someDate.getFullYear(),
    someDate.getMonth(),
    someDate.getDate(),
  )
  const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

  return Math.floor((dateUTC - someDateUTC) / 8.64e7)
}

export const quordleBlacklist = new Set(
  decompress(
    'NoIgggQg8gSgKiANOA4rMTwBkCSBRAOUzBgFlZiYYoB1SgZSiOQizABE9NW893vccAFoCoUfizEQAmtzFxZkxqW7UO3AKpwAwgAlNADSgrkenNoDSmbThQlrMMEMUhOYOPuTtqBLl42kpC7sNCQAYpjs0jgEKJh42mwIyHgWMXEpBOwafiCEeKQYyGFgODAuJQQEFe5gWJglcAoNCXUtcG3FeHAa9Jh29PQudtJ4MP1g0ljDOAAKQ/1M6sgo1LO5KNLzLrokBZi6sNUHvQvIutKkhJg47DhQySAAUhoEHZgvb1CYFgQ4YbksHh1uNkNMCHpMIUwjgiiBCoEXOQfJgoBA8PRclAAGokFw49y5WYcKKYYlYM4gYkESmzWybMkwcxWZCzDTsBms6QoIKYACKOTGmEcWRcMDwJBMICZYSBwqgKCFyHodWx32V2nFuXomrwdGVBWuBrpcPouzCjzNYAILJAZvkmDN4v1dvwisdOEGLnoaXgjrYZv9YGx2qwUHWjoIGjCEWVxM4juptvo6yyicIlpBUpTgkTYmTbJtjpons8IA6MUecBgAVmmFecBw9WQGiZvkw2JwBiNIFC9DguRoeCwkOQQ4pZaHEMnTemmBLOknYlJyCES3qAF0gA==',
  ),
)

export const octordleBlacklist = new Set(
  decompress(
    'NoIgygEg8lAqIBoQBECqBZdBNRIAKAggHJg5IBCM5ZIAokbegbhAQEqMtRtE0SphSLLOnq4AksnFxcAaXFFZNADJYiAYQi503KEVx5xADXG0DbcetkHU5S7gCKqWrTa42xZDTCMxSMOKC3srE8P4hAGpm/oSKuGB4rujxeKhxSLAe6Hi4qBYMuBFQ6OJhIADq4sqquADiWHhCSLXijTRMmDTltMqauEQwPiAAukA',
  ),
)
