import seedrandom from 'seedrandom'

import type { List, IndexMethod } from './types'

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
