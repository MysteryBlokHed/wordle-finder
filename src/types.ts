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

/** Describes a method used to find active words */
export interface IndexMethod {
  /** Whether the method requires a timezone */
  requiresTimezone: boolean
  /** Whether the method requires an active word */
  requiresWord: boolean
  /** Whether the method requries a wordlist */
  requiresList: boolean
  /**
   * Whether the method makes external requests.
   * This displays a notice to the user about external requests while they add the method.
   * When a custom seed is provided, it also makes sure that the method isn't called
   * until the custom seed box is blurred
   */
  external: boolean

  /**
   * Generate a seed from a provided date
   * @param date The date to derive the seed from
   * @param list The list information from the wordlist's creation.
   * Only passed if {@link IndexMethod.requiresList} is `true`
   * @returns The seed to be passed to {@link IndexMethod.method}
   */
  seed(date: Date, list?: List): number

  /**
   * The method to get words. May be asynchronous
   * @param seed The seed to use, either from {@link IndexMethod.seed}
   * or provided by the user
   * @param list The list information from the wordlist's creation.
   * Only passed if {@link IndexMethod.requiresList} is `true`
   * @returns Either the words as a string, an index in the wordlist to use,
   * or null if no word could be found.
   */
  method(
    seed: number,
    list?: List,
  ): string | number | null | Promise<string | number | null>
}
