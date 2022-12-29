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
