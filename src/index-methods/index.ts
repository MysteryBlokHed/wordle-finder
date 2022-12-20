import seedrandom from 'seedrandom'

import QuordleRand, { quordleBlacklist } from './quordle'
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
        .then(json => json.solution)
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
      console.log('Quordle method called for list', list)

      return new Promise((resolve, reject) => {
        if (list.words.length < 4) return reject()

        console.log('Promise beginning')
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

        const rand = new QuordleRand(seed)
        for (let i = 0; i < 4; i++) rand.random_int31()

        let answers: [string, string, string, string]

        // Get new answers until they are all unique and none of them are in the blacklist
        do {
          answers = [
            rand.random_int31() % list.words.length,
            rand.random_int31() % list.words.length,
            rand.random_int31() % list.words.length,
            rand.random_int31() % list.words.length,
          ].map(index => list.words[index]) as any
        } while (
          // Answers are unique
          answers.length !== new Set(answers).size ||
          // No answers blacklisted
          answers.some(answer => quordleBlacklist.has(answer))
        )

        resolve(answers.join(', '))
        console.log('Promise resolved')
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
