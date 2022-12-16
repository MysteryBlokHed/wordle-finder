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
  <Title id="help-modal-title">Help</Title>
  <Content id="help-modal-content">
    <h2>Finding a wordlist</h2>
    <p>
      For most Wordle clones, the wordlist will be an array somewhere in the
      website's source code. This will generally be a long list that looks
      something like
      <code>["FLAME", "BRICK", "SHUNT"]</code>
      or
      <code>['trace', 'chart', 'adieu']</code>
      in a file called
      <code>app.js</code>
      or
      <code>bundle.js</code>
    </p>
    <p>
      Most sites will have two lists: a list of valid words, and a list of
      actual answers. You can often tell the difference pretty easily because
      the list of actual answers will be in a random order, and the list of
      valid words will be alphabetical. Copy the list of actual answers.
    </p>

    <h2>Wordlist methods</h2>
    <p>
      Some Wordle clones will have wordlists that simply map the current day to
      an index in the list, i.e. day 1 is index 5, day 2 is index 6, and so on.
      However, there are others which use a more complex system to select their
      words. The site has some of these methods built-in, which can be selected
      from the dropdown box in the "Add Wordlist" menu.
    </p>
    <p>
      One site that has its method included is a French wordle clone, <a
        href="https://wordle.louan.me/"
        target="_blank"
      >
        wordle.louan.me.
      </a>
      If you're adding this site's wordlist, simply select its method name from the
      dropdown box before saving.
    </p>
  </Content>
  <Actions>
    <Button on:click={() => (open = false)}>
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>

<Button variant="raised" on:click={() => (open = true)}>
  <Label>Help</Label>
  <Icon class="material-icons">help</Icon>
</Button>

<style>
  h2 {
    margin-bottom: 1rem !important;
  }
</style>
