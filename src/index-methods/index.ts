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

import {
  v1Method,
  v2Method,
  octordleSeed,
  quordleBlacklist,
  octordleBlacklist,
} from './quordle'
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
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')

      const formattedDate = `${year}-${month}-${day}`

      return fetch(
        `https://cors-proxy.mysteryblokhed.workers.dev/https:%2F%2Fwww.nytimes.com/svc/wordle/v2/${formattedDate}.json`,
      )
        .then<{ solution?: string }>(r => r.json())
        .then(json => json.solution ?? null)
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

        const answers = v1Method(seed, 4, list.words, quordleBlacklist)

        resolve(answers.join(', '))
      })
    },
  },

  Octordle: {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: true,
    external: false,

    method(date, list: List) {
      if (list.words.length < 8) return null

      const seed = octordleSeed(date)
      const mode = seed >= 178 ? 'v2' : 'v1'

      let answers: string[]

      if (mode === 'v1') {
        const v1Seed =
          seed >= 160 ? seed * 8888 : seed >= 131 ? seed + 8888 : seed
        answers = v1Method(v1Seed, 8, list.words, octordleBlacklist)
      } else {
        answers = v2Method(seed + 98741, 137, 8, list.words, octordleBlacklist)
      }

      return answers.join(', ')
    },
  },

  'Octordle Sequence': {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: true,
    external: false,

    method(date, list: List) {
      if (list.words.length < 8) return null

      const seed = octordleSeed(date)
      const mode = seed >= 178 ? 'v2' : 'v1'

      let answers: string[]

      if (mode === 'v1') {
        const v1Seed = seed * 71104
        answers = v1Method(v1Seed, 8, list.words, octordleBlacklist)
      } else {
        answers = v2Method(seed + 397814, 137, 8, list.words, octordleBlacklist)
      }

      return answers.join(', ')
    },
  },

  'Octordle Rescue': {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: true,
    external: false,

    method(date, list: List) {
      if (list.words.length < 8) return null

      const seed = octordleSeed(date)
      const answers = v2Method(
        seed + 2030301,
        137,
        8,
        list.words,
        octordleBlacklist,
      )

      return answers.join(', ')
    },
  },

  'Octordle Gold': {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: true,
    external: false,

    method(date, list: List) {
      if (list.words.length < 8) return null

      const seed = octordleSeed(date)
      const mode = seed >= 178 ? 'v2' : 'v1'
      console.log(seed)

      let answers: string[]

      if (mode === 'v1') {
        const v1Seed = seed * 8888 + 8
        answers = v1Method(v1Seed, 8, list.words, octordleBlacklist)
      } else {
        answers = v2Method(seed + 33271, 137, 8, list.words, octordleBlacklist)
      }

      return answers.join(', ')
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
