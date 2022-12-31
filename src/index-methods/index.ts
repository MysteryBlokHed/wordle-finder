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
import seedrandom from 'seedrandom'

import { quordleBlacklist, octordleBlacklist } from './quordle'
import type { List, IndexMethod } from '../types'

const METHODS = {
  Normal: {
    requiresTimezone: true,
    requiresWord: true,
    requiresList: true,
    external: false,

    method(date, list: List) {
      const tzOffset =
        list.timezone === 'UTC' ? 0 : date.getTimezoneOffset() * 60_000
      return Math.floor((date.getTime() - tzOffset) / 8.64e7) - list.offset
    },
  },

  Wordle: {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: false,
    external: true,

    method(date) {
      // Wordle uses the local timezone, not UTC
      const formattedDate = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`

      return fetch(
        `https://cors-proxy.mysteryblokhed.workers.dev/https:%2F%2Fwww.nytimes.com/svc/wordle/v2/${formattedDate}.json`,
      )
        .then(r => r.json())
        .then(json => (json as { solution: string }).solution)
        .catch(() => null)
    },
  },

  Quordle: {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: true,
    external: false,

    // Made async in case the random function decides to never stop,
    // which happens occasionally
    method(date, list: List) {
      return new Promise((resolve, reject) => {
        if (list.words.length < 4) return reject()
        // Give up if this takes too long
        setTimeout(() => reject(), 5000)

        const someDate = new Date('01/24/2022')

        const seed =
          ((date.getTime() -
            someDate.getTime() +
            (someDate.getTimezoneOffset() - date.getTimezoneOffset()) *
              60_000) /
            8.64e7) >>
          0

        const rand = new MersenneTwister(seed)
        for (let i = 0; i < 4; i++) rand.random_int31()

        let answers: [string, string, string, string]

        // Get new answers until they are all unique and none of them are in the blacklist
        do {
          answers = [
            rand.random_int31() % list.words.length,
            rand.random_int31() % list.words.length,
            rand.random_int31() % list.words.length,
            rand.random_int31() % list.words.length,
          ].map(index => list.words[index]) as typeof answers
        } while (
          // Answers are unique
          answers.length !== new Set(answers).size ||
          // No answers blacklisted
          answers.some(answer => quordleBlacklist.has(answer))
        )

        resolve(answers.join(', '))
      })
    },
  },

  Octordle: {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: true,
    external: false,

    // Made async in case the v1 random function decides to never stop,
    // which happens occasionally
    method(date, list: List) {
      return new Promise((resolve, reject) => {
        if (list.words.length < 8) return reject()
        // Give up if this takes too long
        setTimeout(() => reject(), 5000)

        const someDate = new Date('01/24/2022')
        const someDateUTC = Date.UTC(
          someDate.getFullYear(),
          someDate.getMonth(),
          someDate.getDate(),
        )
        const dateUTC = Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
        )

        const seed = Math.floor((dateUTC - someDateUTC) / 8.64e7)
        const mode = seed >= 178 ? 'v2' : 'v1'

        let answers: [
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
        ]

        if (mode === 'v1') {
          // Quordle-like, uses seeded RNG
          const v1Seed =
            seed >= 160 ? seed * 8888 : seed >= 131 ? seed + 8888 : seed

          const rand = new MersenneTwister(v1Seed)
          for (let i = 0; i < 8; i++) rand.random_int31()

          // Get new answers until they are all unique and none of them are in the blacklist
          do {
            answers = [
              rand.random_int31() % list.words.length,
              rand.random_int31() % list.words.length,
              rand.random_int31() % list.words.length,
              rand.random_int31() % list.words.length,
              rand.random_int31() % list.words.length,
              rand.random_int31() % list.words.length,
              rand.random_int31() % list.words.length,
              rand.random_int31() % list.words.length,
            ].map(index => list.words[index]) as typeof answers
          } while (
            // Answers are unique
            answers.length !== new Set(answers).size ||
            // No answers blacklisted
            answers.some(answer => quordleBlacklist.has(answer))
          )
        } else {
          // New, featuring a bunch of stuff to make it harder to reverse engineer
          // ...but not quite enough ;)
          let v2Seed = Math.floor((seed + 98741) / 137)

          // Scramble wordbank
          const scrambledWords = [...list.words]

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

          // Select answers
          let offset = ((seed + 98741) * 137) % scrambledWords.length

          // Get new answers until they are all unique and none of them are in the blacklist
          do {
            answers = [
              scrambledWords[offset++ % scrambledWords.length],
              scrambledWords[offset++ % scrambledWords.length],
              scrambledWords[offset++ % scrambledWords.length],
              scrambledWords[offset++ % scrambledWords.length],
              scrambledWords[offset++ % scrambledWords.length],
              scrambledWords[offset++ % scrambledWords.length],
              scrambledWords[offset++ % scrambledWords.length],
              scrambledWords[offset++ % scrambledWords.length],
            ]
          } while (
            // Answers are unique
            answers.length !== new Set(answers).size ||
            // No answers blacklisted
            answers.some(answer => octordleBlacklist.has(answer))
          )
        }

        resolve(answers.join(', '))
      })
    },
  },

  Louan: {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: true,
    external: false,

    method(date, list: List) {
      // Louan uses UTC, not the local timezone
      const formattedDate = `${date.getUTCFullYear()}-${
        date.getUTCMonth() + 1
      }-${date.getUTCDate()}`
      const random = seedrandom(formattedDate)()
      const index = Math.floor(random * (list.words.indexOf('PIZZA') + 1))

      return index
    },
  },
} as const satisfies Record<string, IndexMethod>

export type Method = keyof typeof METHODS

export default METHODS
