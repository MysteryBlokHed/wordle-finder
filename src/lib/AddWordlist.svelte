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
  import IconButton from '@smui/icon-button'
  import Paper, { Title, Content } from '@smui/paper'
  import Select, { Option } from '@smui/select'
  import Snackbar, { Actions } from '@smui/snackbar'
  import Textfield from '@smui/textfield'
  import { DatePicker } from 'date-picker-svelte'

  import METHODS, { type Method } from '../index-methods'
  import PRESET_LISTS, { type PresetList } from '../lists'
  import { lists as listsStore } from '../stores'
  import { numberExp, offsetToString } from '../offset-tz'
  import { LIST_TIMEZONES } from '../types'
  import type { IndexMethod, StoredTimezone } from '../types'

  import '../theme/snackbar.scss'

  /* eslint-disable @typescript-eslint/no-unsafe-call */

  let creating = false
  let methodName: Method = 'Normal'
  let method: IndexMethod = METHODS[methodName]
  let newName = ''
  let newTimezone: StoredTimezone | 'Offset' = 'UTC'
  let newOffset = ''
  let chosenList: PresetList | 'Custom' | ''
  let customList = ''
  let knownWord = ''
  let newDate = new Date()

  let newNameInvalid = false
  let newOffsetInvalid = false
  let chosenListInvalid = false
  let customListInvalid = false
  let knownWordInvalid = false

  $: newName, (newNameInvalid = false)
  $: newOffset, (newOffsetInvalid = false)
  $: chosenList, (chosenListInvalid = false)
  $: customList, (customListInvalid = false)
  $: knownWord, (knownWordInvalid = false)

  $: method = METHODS[methodName]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let snackbar: Snackbar & { open: any }
  let snackbarLabel: string

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 10)

  const save = () => {
    // Make sure the name is not empty
    if (!newName.trim().length) {
      newNameInvalid = true
      snackbarLabel = 'Name cannot be empty'
      snackbar.open()
      throw new TypeError('Name cannot be empty')
    } else {
      newNameInvalid = false
    }

    if (method.requiresWord && !method.requiresList) {
      snackbarLabel = '(Internal Error)'
      snackbar.open()
      throw new TypeError('Method must require list to require word')
    }

    let list: readonly string[] = []

    if (method.requiresList) {
      if (!chosenList) {
        chosenListInvalid = true
        snackbarLabel = 'A list must be selected for this method'
        snackbar.open()
        throw new TypeError(
          `A list must be selected for the method ${methodName}`,
        )
      } else {
        chosenListInvalid = false
      }

      if (chosenList === 'Custom') {
        // Custom list being used
        // Parse list and ensure it's an array
        let listParsed: string | readonly string[]
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          listParsed = JSON.parse(customList.replaceAll("'", '"'))

          if (typeof listParsed === 'string') {
            listParsed = listParsed.split(' ')
          }

          const array = Array.isArray(listParsed)
          if (!array || (array && !listParsed.length)) {
            throw new TypeError('Invalid list provided')
          }
        } catch {
          customListInvalid = true
          snackbarLabel = 'Invalid list provided'
          snackbar.open()
          throw new TypeError('Invalid list provided')
        }
        customListInvalid = false

        list = listParsed
      } else {
        // Preset list being used
        list = PRESET_LISTS[chosenList]
      }
    }

    let offset = -1

    if (method.requiresWord) {
      const wordIndex = list.findIndex(
        word => word.toLowerCase() === knownWord.toLowerCase(),
      )

      if (wordIndex === -1) {
        knownWordInvalid = true
        snackbarLabel = 'Provided word not in list'
        snackbar.open()
        throw new TypeError('Provided word not in list')
      } else {
        knownWordInvalid = false
      }

      // Calculate index offset
      const tzOffset =
        newTimezone === 'UTC' ? 0 : newDate.getTimezoneOffset() * 60_000
      offset = Math.floor((newDate.getTime() - tzOffset) / 8.64e7) - wordIndex
    }

    switch (methodName) {
      case 'Wordle':
      case 'Quordle':
      case 'Octordle':
      case 'Octordle Sequence':
      case 'Octordle Rescue':
      case 'Octordle Gold':
      case 'Contexto':
        newTimezone = 'Local'
        break
      case 'Louan':
      case 'Xordle':
        newTimezone = 'UTC'
        break
    }

    if (newTimezone === 'Offset') {
      if (!numberExp.test(newOffset)) {
        newOffsetInvalid = true
        snackbarLabel = 'Timezone offset is invalid'
        snackbar.open()
        throw new TypeError('Timezone offset is invalid')
      } else {
        newOffsetInvalid = false
      }

      const offset = parseInt(newOffset)
      newTimezone = offsetToString(offset)
    }

    // Update known lists
    listsStore.update(lists => ({
      ...lists,
      [newName]: {
        words: list,
        offset: offset,
        method: methodName,
        timezone: newTimezone as StoredTimezone,
      },
    }))

    // Reset values
    creating = false
    methodName = 'Normal'
    newName = ''
    newTimezone = 'UTC'
    newOffset = ''
    chosenList = ''
    customList = ''
    knownWord = ''
    newDate = new Date()
  }
</script>

<Snackbar bind:this={snackbar} labelText={snackbarLabel} class="error">
  <Label />
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<Button on:click={() => (creating = !creating)} variant="raised">
  <Label>Add Wordlist</Label>
  <Icon class="material-icons">add_circle</Icon>
</Button>
{#if creating}
  <br />
  <Textfield
    bind:value={newName}
    bind:invalid={newNameInvalid}
    label="Wordlist Name"
  />
  <br />
  <Select bind:value={methodName} label="Word Method">
    {#each Object.keys(METHODS) as method}
      <Option value={method}>{method}</Option>
    {/each}
  </Select>

  {#if method.external}
    <br />
    <Paper>
      <Title>Note</Title>
      <Content>
        This method will use external sites to retrieve the word.
      </Content>
    </Paper>
  {/if}

  {#if method.requiresTimezone}
    <br />
    <Select bind:value={newTimezone} label="Timezone">
      {#each LIST_TIMEZONES as timezone}
        <Option value={timezone}>{timezone}</Option>
      {/each}
    </Select>
    {#if newTimezone === 'Offset'}
      <br />
      <Textfield
        bind:value={newOffset}
        bind:invalid={newOffsetInvalid}
        label="Offset (i.e. +2 or -5)"
      />
    {/if}
  {/if}

  {#if method.requiresList}
    <br />
    <Select
      bind:value={chosenList}
      bind:invalid={chosenListInvalid}
      label="Wordlist"
    >
      {#each Object.keys(PRESET_LISTS) as list}
        <Option value={list}>{list}</Option>
      {/each}
      <Option value="Custom">Custom</Option>
    </Select>
    {#if chosenList === 'Custom'}
      <br />
      <Textfield
        bind:value={customList}
        bind:invalid={customListInvalid}
        label="Wordlist (Raw Array/String)"
      />
    {/if}
  {/if}

  {#if method.requiresWord}
    <br />
    <Textfield
      bind:value={knownWord}
      bind:invalid={knownWordInvalid}
      label="Known Word"
    />
    <br />
    <span>Day of word:</span>
    <br />
    <DatePicker
      bind:value={newDate}
      locale={{ weekStartsOn: 0 }}
      max={maxDate}
    />
  {/if}

  {#if method.requiresList || method.requiresWord} <br /> {/if}
  <br />
  <Button on:click={save} variant="raised">
    <Label>Save</Label>
    <Icon class="material-icons">save</Icon>
  </Button>
{/if}
<div />
