import { writable } from 'svelte/store'
import type { List } from './types'

export const lists = writable<Record<string, List>>(
  JSON.parse(localStorage.getItem('lists') ?? '{}') as Record<string, List>,
)

lists.subscribe(value => localStorage.setItem('lists', JSON.stringify(value)))
