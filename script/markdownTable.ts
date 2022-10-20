export const markdownTable = (data: {[key: string]: string}[]): string => {
  // header
  const keys = Object.keys(data[0])
  let output = `| ${keys.join(' | ')} |\n`
  output += `| ${keys.map(_ => '---').join(' | ')} |\n`
  // add rows
  for (const row of data) {
    const values = Object.values(row)
    output += `| ${values.join(' | ')} |\n`
  }

  return output
}
