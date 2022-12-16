<script lang="ts">
  import Wordlists from './lib/Wordlists.svelte'
  import CreateWordlist from './lib/CreateWordlist.svelte'
</script>

<main>
  <h1>Wordle Finder</h1>
  <h2>Find the current word for any given wordlist</h2>
  <h3>Dates are in UTC!</h3>
  <h4>
    *Note that this won't actually work for the original Wordle's list,
    <br />
    since its list doesn't simply map the current day to an index
  </h4>
  <Wordlists />
  <br />
  <br />
  <CreateWordlist />
</main>
