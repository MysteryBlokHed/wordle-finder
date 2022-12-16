<script lang="ts">
  import Button, { Label } from '@smui/button'
  import Checkbox from '@smui/checkbox'
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

  const findCurrentWord = (date: Date, list: List): string => {
    if (!(list.method in METHODS))
      throw new TypeError(`Unknown method ${list.method} specified`)

    const index = METHODS[list.method].method(date, list)
    if (!(index in list.list)) return '(Not Found)'

    return list.list[index].toUpperCase()
  }

  let options: Array<{ name: string; word: string }>
  $: options = Object.entries(lists).map(([key, value]) => ({
    name: key,
    word: findCurrentWord(wordDate, value),
  }))
  let selected = []

  const deleteSelected = () => {
    for (const option of selected) {
      delete lists[option.name]
      options.splice(options.indexOf(option), 1)
    }
    selected.length = 0
    listsStore.set(lists)
  }

  window.lists = lists
</script>

<Button on:click={() => (pickerShown = !pickerShown)} variant="raised">
  <Label>Select Date For Word</Label>
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
      <Cell checkbox>
        <Checkbox />
      </Cell>
      <Cell>List Name</Cell>
      <Cell>Word</Cell>
    </Row>
  </Head>
  <Body>
    {#each options as option}
      <Row>
        <Cell checkbox>
          <Checkbox
            bind:group={selected}
            checked={selected.includes(option)}
            value={option}
            valueKey={option.name}
          />
        </Cell>
        <Cell>{option.name}</Cell>
        <Cell>{option.word}</Cell>
      </Row>
    {/each}
  </Body>
</DataTable>
{#if selected.length}
  <br />
  <Button on:click={deleteSelected} variant="raised" color="secondary">
    <Label>
      Delete {selected.length}
      {selected.length === 1 ? 'list' : 'lists'}
    </Label>
  </Button>
{/if}
