# Wordle Finder

<https://wordle.adamts.me>

A site to add generic wordlists for Wordle-like games and find solutions for a given date.

## Use

Usage is documented on the website itself and can be found by pressing the "Help" button at the bottom.

## Building

Yarn is used to build the project.
To install dependencies, run:

```sh
yarn install
```

To start a development server, run:

```sh
yarn dev
```

To build for production, run:

```sh
yarn build
```

## Contrubuting

### Adding builtin wordlists

Builtin wordlists are compressed using lz-string to reduce bundle size.
Here's how to compress and add a list:

1. Save the wordlist to a file containing a JSON array`

   ```jsonc
   // list.json
   ["flame", "brick" /* etc */]
   ```

2. Run the `compress-list` script

   ```sh
   yarn compress-list list.json
   ```

3. Copy the outputted base 64 (also saved to a file ending in `.compressed`)
4. Add an entry to the `PRESET_LISTS` constant in `src/lists.ts`

   ```typescript
   const PRESET_LISTS = {
     // ...
     'Some List': decompress('NoIgZgNghgtgpiANCARgJwJYGMDWIC6QA==='),
   }
   ```

## License

This project is licensed under the GNU Affero General Public License, Version 3.0
([LICENSE](LICENSE) or <https://www.gnu.org/licenses/agpl-3.0.en.html>).
