import type { Method } from './index-methods'

export const LIST_TIMEZONES = ['UTC', 'Local'] as const

export type ListTimezone = typeof LIST_TIMEZONES[number]

export interface List {
  /** The wordlist itself */
  words: readonly string[]
  /** The offset in days since the epoch to map the current day to an array index */
  offset: number
  /** The name of the method used to find the word index */
  method: Method
  /** The timezone for the reset */
  timezone: ListTimezone
}

export interface IndexMethod {
  requiresTimezone: boolean
  requiresWord: boolean
  requiresList: boolean
  external: boolean

  method(
    date: Date,
    list?: List,
  ): string | number | null | Promise<string | number | null>
}
