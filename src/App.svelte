<script lang="ts">
  import Wordlists from './lib/Wordlists.svelte'
  import CreateWordlist from './lib/CreateWordlist.svelte'
  import HelpModal from './lib/HelpModal.svelte'
</script>

<main>
  <h1>Wordle Finder</h1>
  <h2>Find the current word for any given wordlist</h2>
  <Wordlists />
  <br />
  <br />
  <CreateWordlist />
  <br />
  <HelpModal />
</main>
