import seedrandom from 'seedrandom'

import type { SeedMethod } from './types'

const METHODS = {
  Normal: {
    requiresWord: true,

    method(date, list) {
      return Math.floor(date.getTime() / 8.64e7) - list.offset
    },
  },

  Wordle: {
    requiresWord: false,

    method(date) {
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
    requiresWord: false,

    method(date, list) {
      const formattedDate = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`
      const random = seedrandom(formattedDate)()
      const index = Math.floor(random * (list.list.indexOf('PIZZA') + 1))

      return index
    },
  },
} as const satisfies Record<string, SeedMethod>

export type Method = keyof typeof METHODS

export default METHODS
