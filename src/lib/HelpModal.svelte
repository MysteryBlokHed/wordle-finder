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
  import Dialog, { Title, Content, Actions } from '@smui/dialog'

  let open = false
</script>

<Dialog
  bind:open
  aria-labelledby="help-modal-title"
  aria-describedby="help-modal-content"
  surface$style="width: 500px; max-width: calc(100vw - 32px);"
>
  <Title id="help-modal-title">How To Use</Title>
  <Content id="help-modal-content">
    <h2>Wordlist methods</h2>
    <p>
      Some Wordle clones will have wordlists that simply map the current day to
      an index in the list, i.e. day 1 is index 5, day 2 is index 6, and so on.
      However, there are others which use a more complex system to select their
      words. The site has some of these methods built-in, which can be selected
      from the dropdown box in the "Add Wordlist" menu.
    </p>
    <p>The original Wordle has a method included in the dropdown.</p>
    <p>
      Another site that has its method included is
      <a href="https://www.quordle.com" target="_blank" rel="noreferrer">
        Quordle.
      </a>
      If you're adding Quordle's wordlist, simply select its method name from the
      dropdown box before saving.
    </p>

    <h2>Known wordlists</h2>
    <p>
      Wordlists for a few websites are already included and can be selected from
      the "Wordlist" dropdown box. If the wordlist you're looking for isn't
      included, select "Custom" from the dropdown and paste the list into the
      provided text box.
    </p>

    <h2>Finding a wordlist</h2>
    <p>
      For most Wordle clones, the wordlist will be an array somewhere in the
      website's source code. This will generally be a long list that looks
      something like
      <code>["FLAME", "BRICK", "SHUNT"]</code>
      or
      <code>'trace salet adieu'</code>
      in a file called
      <code>app.js</code>
      or
      <code>bundle.js.</code>
      If your list is formatted as series of space-separated words, make sure to
      include the quotes.
    </p>
    <p>
      The original Wordle doesn't require a wordlist to be provided due to its
      implementation.
    </p>
    <p>
      Most sites will have two lists: a list of valid words, and a list of
      actual answers. You can often tell the difference pretty easily because
      the list of actual answers will be in a random order, and the list of
      valid words will be alphabetical. Copy the list of actual answers.
    </p>
  </Content>
  <Actions>
    <Button on:click={() => (open = false)}>
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>

<Button variant="raised" on:click={() => (open = true)}>
  <Label>How To Use</Label>
  <Icon class="material-icons">help</Icon>
</Button>

<style>
  h2 {
    margin-bottom: 1rem !important;
  }
</style>
