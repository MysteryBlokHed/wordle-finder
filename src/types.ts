import type { Method } from './seed-methods'

export interface List {
  /** The wordlist itself */
  list: string[]
  /** The offset in days since the epoch to map the current day to an array index */
  offset: number
  /** The name of the method used to find the word index */
  method: Method
}

export interface SeedMethod {
  requiresWord: boolean
  requiresList: boolean
  external: boolean

  method(
    date: Date,
    list?: List,
  ): string | number | null | Promise<string | number | null>
}
