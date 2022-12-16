import seedrandom from 'seedrandom'

import type { SeedMethod } from './types'

const METHODS = {
  Normal: {
    requiresWord: true,

    method(date, list) {
      return Math.floor(date.getTime() / 8.64e7) - list.offset
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
