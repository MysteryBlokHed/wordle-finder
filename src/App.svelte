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

  import Wordlists from './lib/Wordlists.svelte'
  import AddWordlist from './lib/AddWordlist.svelte'
  import HelpModal from './lib/HelpModal.svelte'
</script>

<main>
  <h1 style="margin-bottom: 0;">Wordle Finder</h1>
  <h2>Find the current word for any given wordlist</h2>
  <HelpModal />
  <br />
  <hr />
  <Wordlists />
  <br />
  <br />
  <AddWordlist />
  <br />
  <Button
    variant="raised"
    color="secondary"
    href="//gitlab.com/MysteryBlokHed/wordle-finder"
    target="_blank"
    rel="noreferrer"
  >
    <Label>Source</Label>
    <Icon class="material-icons">open_in_new</Icon>
  </Button>
</main>
