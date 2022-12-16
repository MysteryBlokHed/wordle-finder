<script lang="ts">
  import Button from '@smui/button'
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table'
  import { DatePicker } from 'date-picker-svelte'
  import METHODS from '../seed-methods'

  import { lists as listsStore } from '../stores'
  import type { List } from '../types'

  let lists: Record<string, List> = {}
  let wordDate = new Date()
  let pickerShown = false

  const maxDate = new Date(`${new Date().getFullYear() + 10}-02-01`)

  wordDate.setDate(wordDate.getUTCDate())

  listsStore.subscribe(value => (lists = value))

  const findCurrentWord = (date: Date, list: string): string => {
    if (!(list in lists)) throw new TypeError(`List ${list} not found`)
    const listObj = lists[list]
    if (!(listObj.method in METHODS))
      throw new TypeError(`Unknown method ${listObj.method} specified`)

    const index = METHODS[listObj.method].method(date, listObj)
    if (!(index in lists[list].list)) return '(Not Found)'

    return lists[list].list[index].toUpperCase()
  }

  window.lists = lists
</script>

<Button on:click={() => (pickerShown = !pickerShown)} variant="raised">
  Select Date For Word
</Button>
{#if pickerShown}
  <br />
  <br />
  <DatePicker
    bind:value={wordDate}
    locale={{ weekStartsOn: 0 }}
    max={maxDate}
  />
{/if}
<br />
<br />
<DataTable table$aria-label="List of wordlists">
  <Head>
    <Row>
      <Cell>List Name</Cell>
      <Cell>Word</Cell>
    </Row>
  </Head>
  <Body>
    {#each Object.keys(lists) as name}
      <Row>
        <Cell>{name}</Cell>
        <Cell>{findCurrentWord(wordDate, name)}</Cell>
      </Row>
    {/each}
  </Body>
</DataTable>
