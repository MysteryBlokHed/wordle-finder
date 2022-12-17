<script lang="ts">
  import Button, { Icon, Label } from '@smui/button'
  import IconButton from '@smui/icon-button'
  import Paper, { Title, Content } from '@smui/paper'
  import Select, { Option } from '@smui/select'
  import Snackbar, { Actions } from '@smui/snackbar'
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

  let newNameInvalid = false
  let newListInvalid = false
  let knownWordInvalid = false

  $: method = METHODS[methodName]

  let snackbar: Snackbar
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

    // Parse list and ensure it's an array
    let listParsed: string[] = []
    if (method.requiresList) {
      try {
        listParsed = JSON.parse(newList.replaceAll("'", '"'))

        if (!Array.isArray(listParsed))
          throw new TypeError('Invalid list provided')
      } catch {
        newListInvalid = true
        snackbarLabel = 'Invalid list provided'
        snackbar.open()
        throw new TypeError('Invalid list provided')
      }
      newListInvalid = false
    }

    let offset = -1

    if (method.requiresWord) {
      const wordIndex = listParsed.findIndex(
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
    methodName = 'Normal'
    newName = ''
    newList = ''
    knownWord = ''
    newDate = new Date()
  }
</script>

<Snackbar bind:this={snackbar} labelText={snackbarLabel}>
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

  {#if method.requiresList}
    <br />
    <Textfield
      bind:value={newList}
      bind:invalid={newListInvalid}
      label="Wordlist (Raw JS Array)"
    />
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
