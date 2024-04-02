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
import seedrandom from 'seedrandom'

import {
  v1Method,
  v2Method,
  octordleSeed,
  quordleBlacklist,
  octordleBlacklist,
} from './quordle'
import xordle from './xordle'
import type { List, IndexMethod } from '../types'

const METHODS = {
  Normal: {
    requiresTimezone: true,
    requiresWord: true,
    requiresList: true,
    external: false,

    seed(date, list: List) {
      const tzOffset =
        list.timezone === 'UTC' ? 0 : date.getTimezoneOffset() * 60_000
      return Math.floor((date.getTime() - tzOffset) / 8.64e7) - list.offset
    },

    method: seed => seed,
  },

  Wordle: {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: false,
    external: true,

    seed(date) {
      const offsetDate = new Date('2021/06/19')
      offsetDate.setHours(date.getHours(), 0, 0, 0)
      return Math.floor((date.getTime() - offsetDate.getTime()) / 8.64e7)
    },

    method(seed) {
      const date = new Date('2021/06/19')
      date.setDate(date.getDate() + seed)

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

    seed(date) {
      const offsetDate = new Date('2022/01/24')
      const seed =
        ((date.getTime() -
          offsetDate.getTime() +
          (offsetDate.getTimezoneOffset() - date.getTimezoneOffset()) *
            60_000) /
          8.64e7) >>
        0

      return seed
    },

    method(seed, list: List) {
      if (list.words.length < 4) return null
      const answers = v1Method(seed, 4, list.words, quordleBlacklist)
      return answers.join(', ')
    },
  },

  Octordle: {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: true,
    external: false,

    seed: date => octordleSeed(date),

    method(seed, list: List) {
      if (list.words.length < 8) return null

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

    seed: date => octordleSeed(date),

    method(seed, list: List) {
      if (list.words.length < 8) return null

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

    seed: date => octordleSeed(date),

    method(seed, list: List) {
      if (list.words.length < 8) return null

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

    seed: date => octordleSeed(date),

    method(seed, list: List) {
      if (list.words.length < 8) return null

      const mode = seed >= 178 ? 'v2' : 'v1'

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

    seed(date, list: List) {
      const formattedDate = `${date.getUTCFullYear()}-${
        date.getUTCMonth() + 1
      }-${date.getUTCDate()}`
      const random = seedrandom(formattedDate)()
      return Math.floor(random * (list.words.indexOf('PIZZA') + 1))
    },

    method: seed => seed,
  },

  Xordle: {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: false,
    external: false,

    seed(date) {
      const offsetDate = new Date('2022/04/01')
      const seed = Math.floor((date.getTime() - offsetDate.getTime()) / 8.64e7)
      return seed
    },

    method: seed => xordle(seed).join(', '),
  },

  Contexto: {
    requiresTimezone: false,
    requiresWord: false,
    requiresList: false,
    external: true,

    seed(date) {
      const offsetDate = new Date('2022/09/18')
      offsetDate.setHours(date.getHours(), 0, 0, 0)
      return Math.floor((date.getTime() - offsetDate.getTime()) / 8.64e7)
    },

    async method(seed) {
      const spanishSeed = seed - 250
      const portugueseSeed = seed + 207

      const getWord = (language: string, seed: number) =>
        fetch(
          `https://cors-proxy.mysteryblokhed.workers.dev/https:%2F%2Fapi.contexto.me/machado/${language}/giveup/${seed}`,
        )
          .then<{ word?: string }>(r => r.json())
          .then(json => json.word ?? null)
          .catch(() => null)

      const english = (await getWord('en', seed)) || 'Not Found'
      const spanish = (await getWord('es', spanishSeed)) || 'Not Found'
      const portuguese = (await getWord('pt-br', portugueseSeed)) || 'Not Found'

      return `EN: ${english}, ES: ${spanish}, PT: ${portuguese}`
    },
  },
} as const satisfies Record<string, IndexMethod>

export type Method = keyof typeof METHODS

export default METHODS
