<script lang="ts">
  import Button, { Icon, Label } from '@smui/button'

  import Wordlists from './lib/Wordlists.svelte'
  import CreateWordlist from './lib/CreateWordlist.svelte'
  import HelpModal from './lib/HelpModal.svelte'
</script>

<main>
  <h1 style="margin-bottom: 0;">Wordle Finder</h1>
  <h2>Find the current word for any given wordlist</h2>
  <Wordlists />
  <br />
  <br />
  <CreateWordlist />
  <br />
  <HelpModal />
  <br />
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
