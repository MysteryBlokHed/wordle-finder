<!--
Wordle Finder - A site to add generic wordlists for Wordle-like games
and find solutions for a given date.
Copyright (C) 2022  Adam Thompson-Sharpe

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, version 3.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import Button, { Icon, Label } from '@smui/button'
  import Checkbox from '@smui/checkbox'
  import IconButton from '@smui/icon-button'
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table'
  import Textfield from '@smui/textfield'
  import { DatePicker } from 'date-picker-svelte'
  import METHODS from '../index-methods'
  import { stringToOffset } from '../offset-tz'

  import { lists as listsStore } from '../stores'
  import type { List, StoredTimezone } from '../types'

  /* eslint-disable @typescript-eslint/no-unsafe-argument */

  let lists: Record<string, List> = {}
  let wordDate = new Date()
  let today: Date
  let wordTime = `${wordDate.getHours()}:${wordDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
  let wordTimeInvalid = false
  let pickerShown = false
  let customSeedShown = false
  let customSeed = ''
  let customSeedInvalid = false
  let validCustomSeed = -1
  let validCustomSeedOnChange = -1

  const updateToday = () => {
    today = new Date()
    setTimeout(updateToday, 1000 - today.getMilliseconds())
  }
  updateToday()

  // Validate time field for date picker
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

  // Validate custom seed
  const intRegex = /^[+-]?\d*$/
  $: (() => {
    if (!customSeed) {
      validCustomSeedOnChange = validCustomSeed = -1
      customSeedInvalid = false
      return
    }

    const valid = intRegex.test(customSeed)

    if (!valid) {
      customSeedInvalid = true
      return
    } else {
      customSeedInvalid = false
    }

    validCustomSeed = parseInt(customSeed)
  })()

  // Update validCustomSeedOnChange only when the onChange event of the custom seed box is fired
  // (only happens when it has been blurred and a change has occurred)
  const onCustomSeedChange = () => (validCustomSeedOnChange = validCustomSeed)

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 10)

  listsStore.subscribe(value => (lists = value))

  const findCurrentWord = async (
    date: Date,
    list: List,
    overrideSeed: number,
  ): Promise<string> => {
    if (!(list.method in METHODS)) {
      console.error(TypeError(`Unknown method ${list.method} specified`))
      return 'Not Found'
    }

    let indexOrWord: string | number | null

    try {
      const method = METHODS[list.method]
      const seed = overrideSeed !== -1 ? overrideSeed : method.seed(date, list)
      indexOrWord = await method.method(seed, list)
      if (indexOrWord === null) return 'Not Found'
    } catch {
      return 'Not Found'
    }

    if (typeof indexOrWord === 'number') {
      if (!(indexOrWord in list.words)) return 'Not Found'
      return list.words[indexOrWord].toUpperCase()
    } else {
      return indexOrWord.toUpperCase()
    }
  }

  type Option = { name: string; word: string; timezone: StoredTimezone }

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
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .forEach(async ([name, list], i) => {
        // If the method makes external calls, wait until the custom seed box has been blurred
        // before making another request to the website to avoid spamming requests
        if (
          METHODS[list.method].external &&
          validCustomSeedOnChange !== validCustomSeed
        ) {
          return
        }

        const word = await findCurrentWord(wordDate, list, validCustomSeed)
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

  const nextWord = (timezone: StoredTimezone, today: Date): string => {
    const tomorrow = new Date()

    if (timezone === 'Local') {
      tomorrow.setHours(24, 0, 0, 0)
    } else if (timezone === 'UTC') {
      tomorrow.setUTCHours(24, 0, 0, 0)
    } else {
      // This may be far more complicated than necessary, but it's what I came up with around midnight
      // Start at 00:00 local time tomorrow
      tomorrow.setHours(24, 0, 0, 0)
      // Get local and target offsets
      const localOffset = tomorrow.getTimezoneOffset() / 60
      const methodOffset = stringToOffset(timezone)

      tomorrow.setHours(-localOffset - methodOffset)

      // Ensure that negative times don't appear
      const deltaMs = tomorrow.getTime() - today.getTime()
      if (deltaMs < 0) tomorrow.setDate(tomorrow.getDate() + 1)
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

<Button on:click={() => (customSeedShown = !customSeedShown)} variant="raised">
  <Label>Custom Seed</Label>
  <Icon class="material-icons">numbers</Icon>
</Button>
{#if customSeedShown}
  <h4 style="margin-bottom: 0;">This takes precedent over the date picker</h4>
  <Textfield
    bind:value={customSeed}
    bind:invalid={customSeedInvalid}
    on:change={onCustomSeedChange}
    label="Seed (i.e. Puzzle Number)"
  >
    <IconButton
      on:click={() => (customSeed = '')}
      class="material-icons"
      slot="trailingIcon"
      disabled={!customSeed}
    >
      delete
    </IconButton>
  </Textfield>
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
