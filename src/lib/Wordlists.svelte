<script lang="ts">
  import Button, { Icon, Label } from '@smui/button'
  import Checkbox from '@smui/checkbox'
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table'
  import Textfield from '@smui/textfield'
  import { DatePicker } from 'date-picker-svelte'
  import METHODS from '../index-methods'

  import { lists as listsStore } from '../stores'
  import type { List, ListTimezone } from '../types'

  let lists: Record<string, List> = {}
  let wordDate = new Date()
  let today = new Date()
  let wordTime = `${wordDate.getHours()}:${wordDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
  let wordTimeInvalid = false
  let pickerShown = false

  setTimeout(
    () =>
      setInterval(() => {
        today = new Date()
      }, 1000),
    1000 - today.getMilliseconds(),
  )

  const timeRegex = /^(1?\d|2[0-3]):([0-5]\d)$/

  $: (() => {
    // Try to parse the provided time
    const match = wordTime.match(timeRegex)

    if (!match) {
      wordTimeInvalid = true
      return
    } else {
      wordTimeInvalid = false
    }

    const hours = parseInt(match[1])
    const minutes = parseInt(match[2])

    wordDate.setHours(hours)
    wordDate.setMinutes(minutes)

    // Invalidate to update words
    wordDate = wordDate
  })()

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 10)

  listsStore.subscribe(value => (lists = value))

  const findCurrentWord = async (date: Date, list: List): Promise<string> => {
    if (!(list.method in METHODS))
      throw new TypeError(`Unknown method ${list.method} specified`)

    const indexOrWord = await METHODS[list.method].method(date, list)
    if (indexOrWord === null) return 'Not Found'

    if (typeof indexOrWord === 'number') {
      if (!(indexOrWord in list.list)) return 'Not Found'
      return list.list[indexOrWord].toUpperCase()
    } else {
      return indexOrWord
    }
  }

  type Option = { name: string; word: string; timezone: ListTimezone }

  let options: Option[]

  $: {
    // Set options to "Getting word..." by default
    options = Object.entries(lists)
      // Make sure options are in alphabetical order
      .sort()
      .map(([key, value]) => ({
        name: key,
        word: 'Getting Word...',
        timezone: value.timezone,
      }))

    // Get the word for each wordlist
    // This is set up so that any asynchronous getters won't block the others from being displayed;
    // each word will show up as soon as it's ready
    // Side note: I absolutely love that this worked first try with Svelte without needing to do any hacks <3
    Object.entries(lists)
      // Make sure options are in alphabetical order
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .forEach(async ([name, list], i) => {
        const word = await findCurrentWord(wordDate, list).then(word =>
          word.toUpperCase(),
        )
        options[i] = { name, word, timezone: list.timezone }
      })
  }

  let selected: Option[] = []

  const deleteSelected = () => {
    for (const option of selected) {
      delete lists[option.name]
      options.splice(options.indexOf(option), 1)
    }
    selected.length = 0
    listsStore.set(lists)
  }

  const nextWord = (timezone: ListTimezone, today: Date): string => {
    const tomorrow = new Date()

    if (timezone === 'Local') {
      tomorrow.setHours(24, 0, 0, 0)
    } else {
      tomorrow.setUTCHours(24, 0, 0, 0)
    }

    const deltaMs = tomorrow.getTime() - today.getTime()
    const totalSeconds = Math.floor(deltaMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (totalSeconds % 60).toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }
</script>

<Button on:click={() => (pickerShown = !pickerShown)} variant="raised">
  <Label>Select Date For Word</Label>
  <Icon class="material-icons">event</Icon>
</Button>
{#if pickerShown}
  <h4>Remember to update the time as well!</h4>
  <Textfield
    bind:value={wordTime}
    bind:invalid={wordTimeInvalid}
    label="Time (HH:MM, 24-hour clock)"
  />
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
      <Cell>Timezone</Cell>
      <Cell>Next Reset</Cell>
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
        <Cell>{option.timezone}</Cell>
        <Cell>{nextWord(option.timezone, today)}</Cell>
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
    <Icon class="material-icons">delete</Icon>
  </Button>
{/if}
