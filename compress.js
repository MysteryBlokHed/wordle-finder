import process from 'node:process'
import { readFileSync } from 'node:fs'
import LZString from 'lz-string'

const args = process.argv.slice(2)

if (!args.length) {
  throw new Error('Must provide a path to a wordlist')
}

const buffer = readFileSync(args[0], { encoding: 'utf-8' })
const list = JSON.parse(buffer)

console.log('Parsed List:', list)
console.log('Compressing...')

const compressed = LZString.compressToBase64(JSON.stringify(list))

console.log('Compressed:')
console.log(compressed)
