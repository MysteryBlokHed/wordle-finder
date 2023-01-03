import { decompress } from '../lists'

/**
 * Xordle's wordlist is kept separate due to its format.
 * In the original code it's effectively an ArrayLike value, mapping numbers to values,
 * but it's been modified here to be an array of pairs of strings
 */
const WORDLIST = decompress(
  'NrBEBMEsBdoe1AGlAQwA5oDYFNQF1Ew0UA7SAYyVAFttpsAnfQ0BuFcgCyoEcBXbNhLMw4BthTgqAZzRxImEaDSQSXGdAYoA7kpwoAZgE8qANzjUYSrSqnJqcEthMEwBzKoDmVcu3WvQaWoUTEVkTUgAI1wA6G1BO1BIhj5pbgCSI0xHKk8tWSUoaHVkND4GTxiWBzhwE2Q0lAYAaz0jBgoqcDg+T3SWTQ5cZEiPElaA7NT60EHyaCVoFGl6XOyGFxZsAA80bDDQTxRqYKVybOlhpL4STKVGuqo4BkirAIArcueqJdDNsBWgjQvD4KAUShIyxCVAc8CYAUslkoyAMEhWejgRmhDXKlSUcEw4EYVAMkD6CwypHIM2y4DxASOJxQVEiNzuARuRKYI2WnUmcDglyoKFgfJY0lUqSonHYDCkAT2sBm5zB1AxWIO1D45ClkxuTSozRg0H+oHIbGk0mlRiEzICIswyyocm1/TAS0iApJvQEGNM2ESmj40DdEEgtSuWq0igCKxCrVKbD48pYqLUV00AuBkxQvW4ibg0UWyxNPg8BgM1jg5GaMywpCqYDygqtKMgBhDhUkj1K8hIFJY2k4ISuyQFaoCw5uC2Q5H22SUjOJIwFpYRcDhZgUjsWkHA2NABmec7OkFMnWQYht8PFw47PgsYvdHUkuQFQoVpAvszg8RjLA8f1uUCYggkWThsCFS8wUwU0+kFGdWD3YkAnEJxdHCDg3gGVd8zNfRhFjWhQi6SAGDXcVsH9YQ2w7UNkjBRJfFoAcARIHpEJsPclFGVI8O0cQazOMZvEvRhIlNHY9gOcxLFYwJghIkYOiE2M/wOMgO1NLUThmUlME7WM2RmaIOFDc8JUQocCUbUAyHJLpxGOe4jSUs1h37e49gDKgPDkpR3gJWDckgUh5IY7QDlJBy1MERDyFIR4GWyf0qCHJpKwCUYOATUAbhgU043IllsE8VQlGWaQUBmeBXTOTgFESBwnEKiChGdTBtQmFgxB0GjDlgtB6I6EhRMCYdUoyVRO2QTwBEtJQHGDPC8kq8DVFytA2EmlhmnYoTkGOLBTS25CYUcQyWCaaQckvSBqGCgJ+AoXKZQYD9xV8PZhW0Aw+H/d1yk9GRIXBT8GBKUBVCJbZ7n4V9kDIxxTXy26QOWCcWHYyBpBmCR6BvMBWUwWtHMMeS4DQaBv08R0FtjFRmiudjilDc57siGQ9hIFMwG0EVIYcc9bPMBKDmiS55PAVJS0OjAcCrDUQUEQiALgMr+tReJCdACCmkQm7OSUFRSAQBpiPkhLiJZHGcliDoiwaEg+Are5oBdytkHiMjecODpaDLUhuoBeA7mQLjfdkCgrh6GKrtuTEQqApQdgUUdBQsJRzGj4UGC0E6ekhkaPoBOcnGlbdTSOhWveNU1ar6XOcdsjpPG+Q6JPplgTfYlkcC7sAUuXQJtHbeS8hVmQQlfVCZeVCxTgVTqA/CMlOHktIOMc69FuTHtWAa3uspQJngNq/wWF8bJ+sq6rjYFvDnpIqaSHeZkGgg5/b1XXyJB2sAUCvCJDIZe2ZdqaSuI0BgYCQ7yGRKgTARxbJyGmrkUEcpFyOgAF4ZjeqrUQPRIiIRCJAdqDI+CNSoHQCCOsDBUhmLIecbtnhqhGI6Hmiw4DbBpjYWym9tAzHhmDHqcAcH9QsksRaKBPCnEvCNYOgR4AHVALBLwhQ2DlwaNTL+bhsgihhKkJ8NAeieWQJBKqcFtqjk6q7VCkgDSlAUBuRcWhwThCECXM0fBbC5zYLoAI7gBTAUPvSFg1ZfhUCcHKU0OB/Qx15Fae0etAzPBukoYcgJzrlHwbrcoGxnQljtOKSETMfijwYADXJ0hSbIHPAlHWzEaboN9iQ14zoZTwB4vkVssxsDUDkAFPg/SGH1NsjgTwngZiGB/kROANSwxlXkvDFoJJSGEiUM0QBhZcgdB0aAdKNcaBDOoFXcYhyBI43kp1NQeFkgSAUc9VYDQUCmFMFXNATh35JE6i8JQz06DSkLBJRcApjBUFUA2e+HQekdP2PcPikAOoij4QSbiXtkUNIggtFcTRfbgH5gwT2ZoLAAoCa4g4e1qwKJWC9EkjoA4ImDD5WcBJvgBI8GgHp/BsC+ljHCPSgCFYImOLIiA2B4i+x1AwVKbDfw5OkHTPCKhzDjy0CeEYxlCjYAKjITgKRvBZRuILCMmNS4pE5mY4IwiATBDSD8IQbLxTxGwMCZA2QNaLQkCQHp3Q8y7loMExKiTL5TESICZyAQVT3V1VvYV/Yvm0zOh8ecDDqajQCimrojhgxnCcq9X8mBg1gGCGVeBjC9lbSDrkGU6JI0NTcrIAUCiiTngOPBWtg4GrGt0vcQ+UyGAOAaYlBhzr5IcGeP1FYQyYHGNSFcesnlYyOB4ciqsRtMKjFskeciDCqJkNTDYol/MCY8Wqj0KhjBSGcLqrNbpuam2RNIOyXaKAsFei0SkU1h4IUHG5R2sA9l16GiaIvLY0jDmkhuXoNeBtAEoUHBilkFD1kBGhjsXxv4lBDkYJAqlRaIBUiuO4MiG9mg3Fyk0CwRSwBnmeDSL1+GIJ0nnSpBRVs4W126P47uggZWoATlXfmpSVwIXAlW2azxQnunYOiW925hIc0iRuSCEJVBv11eIX2zVnA/HjPh9h6rv1xzAFwQQwE24hHw2UJUb5BS2U4EM0gVC86OqIJALBWCvm+sbgEUePNU0sICnM4ejo/UBJxpwOsjoTxZXYblOa5j757GAt0UI+HsrKNHlxiq8srjmiGZzIiacSR+JyUGWTxiWpZxCL6CTtR8MXIq+cKl9UyKutmKO1ryixy1CUIE5RLzQo5MgwebQzxwD4bmgoA2zx8lLsdMBPdi6WCjA2hoJofD2ICMchIL9oXG72EYHNlgZUOw9M5PB0QhGY05oVJTNAJknK+0/guZARobOxQBbOetLS2CiqjjF1MzxZb7I2lZgkmyqAdGTnd7WSGJmmjIP2PC+KMrrXGDIRSlTfDTl1UCPrfAPMzAJdQBrw5CW/2Y2cCMPT6zlV888dZ9hpFGLoREsxLmdaWGdj05rl0ibvkQj87iOZLhn0PtS2qiFUcU4CEIE9Xsu2hgXZAqXxs6Ag6TD57uHR277L1vJHG0hasILgPeOtXU0odFWAEIk3qrgoG4dCLKGdWFISp3W+QwFbWeJeTBKHJjfZWO95IR6xTfx1lxPZoKqawQ6zyNDGNczix/GdMeUM0g/NXH3O7L92UKs1CSqmf6wVV7GcOLUUviibBZxgAeNuFQt1HZpNWXUWxuEQYtPJdwFDEiU0YNR1A+4qZpVUBfAEHlNpOKllof7pCpOgCAlBUA72KLFukaK+gyPrAurvsgQKqDwv7ESH75bYB9jJkgZCVS4oliu2QHKy77lKEjGb/cR05VLyx1DCYwzwRuFfrSBiztaci8orZsDJ5upghr6Hiz7pwbihhjYVKJCgz/yKKCAHBJgcKxgTTZ4pAY6TiMBoznjnhB6FjOJmKmCSC2ToDHTnTCy5rLC3LarpqxBxR4TBBGCubjTkxIa3Cmikh0Rlher4h5jEJO6VJ0L6g+AWj4amboCORrYBCto7j2DlCkx8o14sp1TJSFhXCjysyqbb61LVjO6dpkQHAujYHVAbidJmKWh3y25URoy/Bh7r5GCOwgQeDd5TDAQqB0ACGOjCZJD4EbwEh8YqBQZsH9Jmz64WHpKpDzLkDIQ6zdBiIlahQ6whA9CBh9Ij58p0Ywgb6D6MIcK1LZFc5ND5JaIexeRMK1zl6rQ4IyCuTY7iAVbZCRTaTFHOgdDAK25aDBHwAqCUB8pqJsLUF6B9JoyNDm5OpHQlR5ymgMCRYrxmikBmET4hAHA47FQ4H7BEr1JtzpIbhV4MRoHbog5UGYBoH1ieaj7+ZuwdDtbZGsE9Rx7zy46xgeJXDupGJ7QYEyDwx4oEpErZCRDAq25khWANDRYKLNiZy1yPGxjOz35iqOimhiBniq7xiFC1B4jmxMF9adR2orjbBP46ivBlrZCUwQjyDL6sjgBF4mZdq5SP6VEAF9yOCRwlJEadQi5XRUxV6twCmDxoicRDLcGDCkmL7QmVJsCeiISfyQCwz2jnhOb2ARjY4OYY63r4y9pjxcm9ZZTiDMrfqQjY6Fx4RVSOi+w7BzgHBZaYb2h5x74DRJqXxaB8ZjZGwMh7j7yzHyTpQU72D3RGLmgthmAhBoE0polGpCrihyDiB9yJ4Ihv4NAwZPE6BJz7omZqq5SXDUTWBgjL6widIM7kRKoBibFGZAbhw9CeIhgTokjHA+R3aoKHRaieKwh65/Sp5FaHJcE3AGo4TcLwKVAkDJkBL0LSj7Aqk5bQBV7boL4mjjEQCDF8IqBuQoDJIVQEqJBCDmDLHYnATnDTpaoYmArsQ6wLZUHnRVZ1qCAFmB5YYG4PhIgE5E65AiqD6ohRgFJMmmiqA4CISei4rGxWnCg4wJlgAH6mIQDHKFTwC0mzS5jNGxikJ8a1DgBuGgBm6oinkPwpz9jDxtw4UoycpfYqLqxGKejrqBAqn877KzZRYFZYYSDVH4Qtb2ykC07Ly2TYVnFEWxjPRMSIYMhaBPLErXy9o6AHB7rHZXYKB1gdIIBZTpl4VkB2ziiaososRZyMAEkQAx74gqBDKPpMy+xja1AmS8g5L/7RpmL9iKXKDtE9LbHOndz3bKhaCRTEnsCcTYBSqFDQkGzDgMqXxNDHEfxMKTgvmv5LHU5MhoKJZsHGHKBVGmg+llEqKlQ1lBBzIzBNFjJRWRgvkBJ9LlBrCRk5jSpfJ5EwFARGVDQbhqXmGHJAHmrQbRA7HCXmFSW9SgbPihSJAvZtVEyUb9SIhGJEg6qlBGqhhNkMD9RCKVJlRhRQ6Sk3mt49JaD7g6yBlpSM6RxkZuRwjj5HKAVrBrQ4Enx5aso6x6zeksXwqN4VyGHKEkIoHlCeLExGXwD7iFTAllI5wBDPCvBhWSDHlU5uoLX3BbZ6R0AXXbqGbVLyb2jdCeFj5VVy7bCDAdRsWRqmkUb8zYSiAka2W+A5JoTiqAqLlVwaxjRAH96LQmKcSAJtIKhsDbA1SZl8o5RvhvWxghAg6QYXVb5UX7g4yBFrnSmhhEgGRfKvA3T2WtXAQ6B9no5jRDwHVZ4/DPA7nv5ZhdCIUJGWAn6LlOhpmZi6qqCmimbKJxj04645H2pODhRcLDxBBEkMh9ja3IqqkHpxQyAvWxAQRkS+SYg1nJBrYNDqRSKlqAow5bDUTxQPV/ICAm5cAgbpJzmwwFjJgVSWDYrUVaTWDlAHjM3fQY2UyIRlTJ1Ey6VmhnhGIKmf6gDmKOGXxs1RkeC+yqLprhwSAXXRCJUP5aVlarGQIeA355n3SQLDjMmBBN1/gXUKr47IBYhcDySbIDpfJRw27d245yZ7JQBfmUHBb3qQGHAUKeKqCSy9Gu2xbjjgpRLySfA5wfxyXCTsC5RXhP6kCVAHBBiz34S0paISAtKijwL/20KE5YImQ4DWEskv4ZXJZ9YwCQwq5SJYCjg/VBkBhGVAEhAzptx2YZHQBYIYgw1mj5kKbUAWqKLPAlV1W23lwDHkb2pmTqKQM+A6kKKRBEWHaWiYmgkyA/EuLoB4SiKOBbrPDmWlBfijFXTJgwkgRBUCOe3AT3R0G+Z1wlRRFA6p7IDDgfXgE4y5TETaUoMNruxL1+5uKgCfBsCYpMogz+5+lXUNDSSVJLTwUdDuB8Khw0gnmLApAzSyllSVKvDGN5Q8xgFgDniZCajaht5Xa55UCBT9nh7bazhNBoHvDiocY0Cmzx5oUL2Gly6dTALPKH4DB7iV2MBoHQ7DyegIHGyYO3I0l7Y0WTp6w6z7CegYQlNkDKNNh93zpw0KjD14OUKoR+B4Q4Ae6USfotkwChi0xwB8bZ17FYxGD9KLNRBwrfHuaRg/ldJrnECFpZV7iYbhBqqWysl8HPoAiMU+VVpg3aBRJrNMVdnfgHK2SpwVaCNU3Gy66LbbAcBjqIIoAL3cWRWPG1JynpJCOg7H6LSqCtP/QaEhrnkmMcVSxGBrnYbHNGNV5zAKJa54QkK5maUP3KSMT4hMlV5/NjMIJkj9R0CX6yVuQ9a+zUwOT75fBZEgt/0bBP6aD6mw2GOiCm0NAEgGg5h24yDtDeJaoQ07Iv0YUkzE59UAIubDMBgUBjqM0gJPm7w9oNASNQnn2HiWa2S0y7Zp6+mDjQqIQlpDXjSGmdm6Mrb9w9Khz/H7TxbIa+zlCYssh6tQw8zoawk+3ihgjwXcoJO6wNkO5UHWqwH3K+RTNXShqj4fZbDjJ6RjwbMjRhrwzyQhg4Z0oCi+y0acU6B3VeQRsdyxqXzDiCiKF7KQgrB6Q0k6yCMSjwJMYL5EjNQ/AviVI0rKIOaDpnB8BUlIpn4DSRmv7gVh2mlbhRPFmxNcCX2xj1JEqzUwGbw5qzh0ORr5N4M6v4gVAamgCPIOtaA5Wr2hhNvJmzj5uzx9vCgZvynkEGwjGmhztood27CksTUaLCFzEAKhB3O0Pz16DhthoyjbZ2IQmIpf7LPugS7fm9C2TnyLOlWLjnMP4VhP4J7YCHGso5LDgasP5fNP5cs1MjPcEKrG3hxUhlv+7eNCDPbjaQKaqEHwfej8FKB7jhjxRohBNwK90xnarNEXsC2GqoNNmeLON67VueJ3FfJRJoHJDH3UWJ32hYLlAZhcJGIKrgPMUutgAvuQz4qxUnZWLCgeBW236cesBUQpuZAHPrYR0KjhhSiHQGRP6uJhy9LUKFByvsulLrjLS/yGBVzqmcvkm7MAL/tUJyAXXNgPsnumgSxUXTVstaCYdULeoptcCW5yLHC/l0AHhlAyuL4Opu5cAKCIqRrZADasieKbzKKkij31Q1c/jvTjWL6/jFNNcj1w2akK0VTcKIkIW/u27f6LEuWrRDRUDTiZu0jNWZXGwZJ8lBIpx2MO5/aD7sbiyrgxKZnM4q13sMd2R+6VJXO4znSbixiqvtY9WeUAL7l8Pmu+b1qQLEArJ6NQa3roA0FHDt39fwndOv3fO+bW5XDmDgCQ643SR8MYz3DTxNSyOFckbUu3DoZdciEogpBk08FrGr6mjXFUVYF2kQcHBxigMCQihKrlU8YQzWmopB5CC00NC+C0kMwaN0p1NEz7AIfmivqFTmhC9QxQCZwVnL4eDl5ODJwmNAraQKBJGmxbrDlYesALPw21Fcdvo6xZYRMJTsS2TVdSVNCeg6zlY9KjMQQ8SC4yH47sqtkxrochoLHKR8TFgdmBCgJm9onOHxcDDhOLPTE5JPqJwao4dD7+QojCcrYihozYDPQzpLTLUgIqc9Sxemb/olOBTARFfyRPUzDVjBVPToKIR+dbfC3ahEYmV1q4k1H9I8TsKJD/LhR8A7xIuhCD5jDtT1k1hAVv2R3TCmUD4gy1EZBbPFOy92ou7tO1JCBpPrGvB9MzKXyLvfhbSyM75zqArZMEI0Ok3l/DgYAmTc8TWGEFieJ+b7zEAX9LyvpfJM/4iATZ5uwVcF4HrgczVIQOW1Nzhy0kY5VM8PvAYES0HohEEgxJYOspDlRuwN6cTdsDc2yyHRRokHMVBOy47lcGYzbS8KbS5rhhgIjoegIHVgSRd+YBFPvigPKJJk++3JLmBtgqhZd0BTFTqouyKKckw6zZFEEET4Tz4rgMoa8utAOwd0nAJyTBGtFnB5IBCuYSEOCmV5Vt8o8Ca4gZ0R6zhqyB1DiBwRVJP4HAC2GQHrXBgg4/ibLKQhoPCANQMEkaFuvAnxhP4Y6SA9wPGzcBd5hQuWVmlVlmjIZHm3fQ8FyzkIz1coYFFwThDG5uccAIHU4lMmLr4Zb4NUZ1L7E2Z8ZhwZEU0JsgwBfJkidSLDG6y5KgMSEngTlkBHrhYQDYClMJjLHk7IIkwiQElpUmt54Q6EhaQjvUJKwYCu+JMLmAKByQ3BSQddCAl+hAx64iW6LAYrwQ/h20EiY9QIIKiCbyYL23LAIEOQiZOc9kcQVgdcHE6TA90jpPmns3873NoCrWJnKwDnj3BGACjJINn0T4wsLOvPVmpa1QCw8cklKNyB4J1iyQ1GaQDilhlRbaYBCbAZRLQH3CSFOmR1OzsoG8QPY3apKK6KTUQgGB2iw0NcoUz/AcCcqGSGAr1HbrExcKQ4GAL8VDqx9OGiuQErVSIZKIFEdSBxEkGzT4YLIajZiJ6zSDLCh6joegfIKPJTxbSYTEapHR1D4ZQRbI1cm8SbAvtEgvEWxImUmK1xC2YAWFCkylEot8hmOfYJbDcEyBvET+UxkXEgHKFkIsRYIGYwBCRE8s37Tzt+Fgj+cTSQwEkJ31TDTYVokmWyMqKJRVQ00GLD8pT2zY7CTETNLctOxFDt1NmRYRvjZ02Yq8Ts+gN3MbhOEnYyOXrDLmAxhFq0U43CCrNiI+a4te+YkE9HYiLKhkJs8kJJlkCeDkAG+frP3toQupiBV+gcDftUFSa04RoqqF5GVWpiZRxQ0Qn6NwPISoNIIFYnCOzkCCKc/Rh6GQGPj4QygKCfsV9DQVFarJGAWVJXJEiaZbpSsvkC4e6FHhNYvSIsWoJDjMQniXhL/cPizXCyCsFIznPwVSCySeJgRkNAgj1EQFM14AMFGgHrzr6wAn8BmK4Jpxd6JsrIgkBRKSHRZexJKGeRejMHyiH1cOa8GQPlkKwHoWsDRIDAMRH7mkay1be8HHXGwVQJ4kCBwDiyIBKMWQUw2SsESPBX9jElyb0KxI/YZhbxRQOwvhDBGRp5wsRaQKJS1QvAaolnHJKfzNxdBsArIeSKy1klUxFqOggPErGB7kNSgEfAJE3UKHEBPeW/ZEe9EI7OCw0PjPrOKSQy3t+QXRYUBKH6IsAuRddcpqdy7SasnMYdbVMBG9p7IZQF/KHs7RMz0p2sQgQKJJEhYGRnmBQpwMUzLLjcxwETaQNfgURZNhSPKTxLL00SzAGo2uRuu9CsjSJrGiiNcgrS7rFp4qSQMiG2Jaa+R9mrfHqK52+yW5D2Xnf0V0gfTfYJAM6SQLXRTIDxaGRw7IO7HwzBBK+bDWyCzEhjVx64EENYskSOCDsLxbDU0H+nijBSIQ4qM4q4kjh9oWy/0KtmGUSCxJBAWGNZE1DPQHU1cXsfYBdQcBwjVkto/jOxF5rm1a8DePhs1MzHJUnKmge2vwyhxyTCBgY9ulrlaFnRDov0f6IsCyEyEQ+XXGziiNNFCSgSveQoH+MB6gM2motVsv3R166oSx4zcGe5EMDDjz8eNLQKRAeiFRegbIr8RshAz70RiW6MYJMPdHA94i3jSYqhHbCHI2md/IQIZjArl9xA2PQkuz21RyC5gtYnflIMrgE4EsPwQ6TxGTBGVd6nrQYI42j5+jQiPgFuq9zoAgiScGydiNuSAS2RsMn7Q8HFggpw5kAvbGskeCIm28ay3hL2vzF76rcaGJQzNsOBwRtpy2xsH6lcEZCeti4vxXMLlMPAr0wQMZOQMEUZC3ZBwL1coiBU/IIMlJTFQJjKWXRFTUY/UTdG2RYBjUdkqZW/NIlHAQEFEIYTCXpU9bVwr8EeT1ArjAbyjdYw6GEGYJ1hlBjJR1GypRLXKmZsACiXFL2W9Fa1Mc2xcUZ4QKq0TiZxUEIc3D6x5ofgc7HCUQBmZ0pUZXNDsRQJ7RE0sB3mDPEsGUTsl8AeAIAA=',
) as unknown as [string, string][]

export default WORDLIST
