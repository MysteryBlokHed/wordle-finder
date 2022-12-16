<script lang="ts">
  import Button, { Icon, Label } from '@smui/button'
  import Select, { Option } from '@smui/select'
  import Textfield from '@smui/textfield'
  import { DatePicker } from 'date-picker-svelte'

  import METHODS, { type Method } from '../seed-methods'
  import { lists as listsStore } from '../stores'
  import type { SeedMethod } from '../types'

  let creating = false
  let methodName: Method = 'Normal'
  let method: SeedMethod = METHODS[methodName]
  let newName = ''
  let newList = ''
  let knownWord = ''
  let newDate = new Date()

  $: method = METHODS[methodName]

  const maxDate = new Date(`${new Date().getFullYear() + 10}-02-01`)

  // newDate.setDate(newDate.getUTCDate())

  const save = () => {
    // Parse list and ensure it's an array
    const listParsed: string[] = JSON.parse(newList.replaceAll("'", '"'))
    if (!Array.isArray(listParsed)) throw new TypeError('Invalid list provided')

    let offset = -1

    if (method.requiresWord) {
      const wordIndex = listParsed.findIndex(
        word => word.toLowerCase() === knownWord.toLowerCase(),
      )

      if (wordIndex === -1) throw new TypeError('Provided word not in list')

      // Calculate index offset
      // const tzOffset = newDate.getTimezoneOffset() * 60000
      offset = Math.floor(newDate.getTime() / 8.64e7) - wordIndex
    }

    // Update known lists
    listsStore.update(lists => ({
      ...lists,
      [newName]: {
        list: listParsed,
        offset: offset,
        method: methodName,
      },
    }))

    // Reset values
    creating = false
    newName = ''
    newList = ''
    knownWord = ''
    newDate = new Date()
  }
</script>

<Button on:click={() => (creating = !creating)} variant="raised">
  <Label>Add Wordlist</Label>
  <Icon class="material-icons">add_circle</Icon>
</Button>
{#if creating}
  <br />
  <Textfield bind:value={newName} label="Wordlist Name" />
  <br />
  <Textfield bind:value={newList} label="Wordlist (Raw JS Array)" />
  <br />
  <Select bind:value={methodName} label="Word Method">
    {#each Object.keys(METHODS) as method}
      <Option value={method}>{method}</Option>
    {/each}
  </Select>
  {#if method.requiresWord}
    <br />
    <Textfield bind:value={knownWord} label="Known Word" />
    <br />
    <span>Day of word:</span>
    <br />
    <DatePicker
      bind:value={newDate}
      locale={{ weekStartsOn: 0 }}
      max={maxDate}
    />
  {/if}
  <br />
  <br />
  <Button on:click={save} variant="raised">
    <Label>Save</Label>
    <Icon class="material-icons">save</Icon>
  </Button>
{/if}
<div />
