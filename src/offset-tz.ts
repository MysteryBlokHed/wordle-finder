export type Sign = '+' | '-'

export type OffsetString = `UTC${Sign}${number}`
export type OffsetNum<S extends OffsetString> =
  // Positive number
  S extends `UTC+${infer Offset extends number}`
    ? Offset
    : // Negative number
    S extends `UTC+${infer Offset extends number}`
    ? Offset
    : // None
      never

export const numberExp = /^[+-]\d+(?:\.\d+)?$/
export const offsetStringExp = /^UTC([+-]\d+(?:\.\d+)?)$/

export function offsetToString<N extends number>(offset: N): OffsetString {
  const sign = offset >= 0 ? '+' : '-'
  const offsetPositive = Math.abs(offset)

  return `UTC${sign}${offsetPositive}`
}

export function stringToOffset<S extends OffsetString>(
  string: S,
): OffsetNum<S> {
  const match = string.match(offsetStringExp)
  if (!match) {
    throw new TypeError(`Input ${string} was not a proper offset string`)
  }

  return parseInt(match[1]) as OffsetNum<S>
}
