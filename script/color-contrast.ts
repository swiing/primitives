import {ContrastRequirement, contrastRequirements, canvasColors} from './color-contrast.config'
import {Table} from 'console-table-printer'
import {flattenObject} from './utilities/flattenObject'
import colors from '../dist/ts'
import {writeFileSync, mkdirSync, existsSync, readFileSync} from 'fs'
import {normal} from 'color-blend'
import {getContrast, parseToRgba, rgba} from 'color2k'
import {markdownTable} from './markdownTable'
import path from 'path'
import {exec} from 'child_process'

/**
 * Type definitions
 */
type contrastTestResult = {
  contrastPair: string
  pass: string
  contrastRatio: string
  minimumContrastRatio: string
}
/**
 * getOpaqueColor
 * @description calculates the rgb string without opacity from a color with opacity and the background it is placed on
 * @param color
 * @param background
 * @returns rgb string
 */
const getOpaqueColor = (color: string, background: string): string => {
  const [colorR, colorG, colorB, colorAlpha] = parseToRgba(color)
  // color is not transparent
  if (colorAlpha === 1) {
    return color
  }
  // parse BG
  const [bgR, bgG, bgB, bgAlpha] = parseToRgba(background)
  // return mixed color
  const mixed = normal({r: bgR, g: bgG, b: bgB, a: bgAlpha}, {r: colorR, g: colorG, b: colorB, a: colorAlpha})
  return rgba(mixed.r, mixed.g, mixed.b, mixed.a)
}
/**
 * runContrastTest
 * @description runs through all color pairs of a theme and checks the contrasts
 * @param colorPairs
 * @param colors
 * @returns contrastTestResult
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const runContrastTest = (colorPairs: ContrastRequirement[], scopedColors: any): contrastTestResult[] =>
  // Object.fromEntries(
  colorPairs.flatMap(([minimumContrast, colorA, colorB, options]: ContrastRequirement) => {
    // concat name
    const contrastPair = `${colorA} vs. ${colorB}`
    // build required string
    const minimumContrastRatio = `${minimumContrast}:1`
    // colorB is fully opaque
    if (parseToRgba(scopedColors[colorB])[3] === 1) {
      return {
        contrastPair,
        ...testContrast(minimumContrast, scopedColors[colorA], scopedColors[colorB], undefined, contrastPair),
        minimumContrastRatio,
      }
    }
    // if colorB is semi-transparent
    // get the correct canvas colors to test again
    let canvasColorArrays = canvasColors
    // overwrite background if custom canvas array is set
    if (options?.canvas) canvasColorArrays = options.canvas
    // test transparent colorB with default bgs `canvasColors`
    return canvasColorArrays.map(bg => ({
      contrastPair: `${contrastPair} on ${bg}`,
      ...testContrast(minimumContrast, scopedColors[colorA], scopedColors[colorB], scopedColors[bg], contrastPair),
      minimumContrastRatio,
    }))
  })
// )
/**
 * testContrast
 * @description test the contrast of two colors against each other
 * @param minimumContrast
 * @param colorA
 * @param colorB
 * @param bg used to calculate an opaque color if colorB is semi transparent
 * @param contrastPair use for better error messages
 * @returns
 */
const testContrast = (
  minimumContrast: number,
  colorA: string,
  colorB: string,
  bg = '#ffffff',
  contrastPair?: string,
): {pass: string; contrastRatio: string} => {
  // get contrast
  let contrast = 0
  try {
    colorB = getOpaqueColor(colorB, bg)
    colorA = getOpaqueColor(colorA, colorB)
    // get contrast rounded down with 2 decimals
    contrast = Math.floor(getContrast(colorA, colorB) * 100) / 100
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`${contrastPair || ''} as ${colorA} vs.${colorB}: ${err}`)
  }
  return {
    pass: contrast >= minimumContrast ? '✅' : '❌',
    contrastRatio: `${contrast}: 1`,
  }
}
/**
 * renderConsoleTable
 * @description takes the test results per theme and prints a nicely formatted table of the results to the console
 * @param theme
 * @param results
 */
const renderConsoleTable = (theme: string, results: contrastTestResult[]): void => {
  // config table
  const contrastTable = new Table({
    title: `Contrast checks for: ${theme}`,
    charLength: {'❌': 2, '✅': 2},
    colorMap: {
      grey: '\x1b[0;30m', // define customized color
    },
    columns: [
      {
        name: 'contrastPair',
        alignment: 'left',
        title: 'Color pair',
      },
      {
        name: 'pass',
        alignment: 'center',
        title: 'Pass',
      },
      {
        name: 'contrastRatio',
        alignment: 'left',
        title: 'Contrast ratio',
      },
      {
        name: 'minimumContrastRatio',
        alignment: 'left',
        title: 'Min. ratio',
      },
    ],
  })
  // add rows and color
  for (const [index, row] of results.entries()) {
    let color = 'white'
    // turn odd index rows grey (index starts at 0)
    if (index % 2 !== 0) {
      color = 'grey'
    }
    contrastTable.addRow(row, {
      color,
    })
  }
  // print table to console
  // eslint-disable-next-line no-console
  console.log(contrastTable.render())
}

/**
 * run tests, output results to console and store them for json
 */
const results = Object.entries(contrastRequirements).map(([theme, colorPairs]: [string, ContrastRequirement[]]) => {
  // turn deeply nested colors object into one level object like 'fg.default': '#000'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenColors = flattenObject((colors.colors as any)[theme])

  // run tests on all color pairs
  const scopedResults = runContrastTest(colorPairs, flattenColors)
  // failing contrasts
  const failingContrast = scopedResults.reduce((acc, cur) => (cur.pass === '❌' ? acc + 1 : acc), 0)
  // print results to console
  renderConsoleTable(theme, scopedResults)
  if (failingContrast > 0) {
    // eslint-disable-next-line no-console
    console.error('❌ Failing contrast checks:', failingContrast, '\n')
  }
  // return results for json file creation
  return {
    theme,
    results: scopedResults,
  }
})

// write json file for workflow
writeFileSync('dist/color-contrast-check.json', JSON.stringify(results))
// write markdown file for workflow
if (!existsSync('compare/diff')) {
  mkdirSync('compare/diff')
}
if (!existsSync('compare/new')) {
  mkdirSync('compare/new')
}
for (const item of results) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  writeFileSync(`compare/new/${item.theme}.md`, markdownTable(item.results))
  writeFileSync(`compare/new/${item.theme}.json`, JSON.stringify(item.results))
}

// Show & write diff
const diffFiles = async (fileName: string) => {
  const oldBase: contrastTestResult[] = JSON.parse(readFileSync(`compare/base/${fileName}.json`).toString())
  const newObj: contrastTestResult[] = JSON.parse(readFileSync(`compare/new/${fileName}.json`).toString())

  const objectDiff: string[] = []
  for (const [index, item] of oldBase.entries()) {
    // no change in pass
    if (item.pass === newObj[index].pass) continue
    // change
    objectDiff.push(`-| ${Object.values(item).join(' | ')}
+| ${Object.values(newObj[index]).join(' | ')}`)
  }
  //
  const consolePassDiff = `${objectDiff
    .map(diff => {
      return diff.replace('-|', '\x1b[31m-|').replace('+|', '\x1b[32m+|')
    })
    .join(`\n`)}\x1b[0m`
  // write pass diff
  writeFileSync(`compare/diff/pass-${fileName}.diff`, objectDiff.join(`\n`))

  await exec(
    `/usr/bin/diff --unified=0 ${path.join(__dirname, '../', `compare/base/${fileName}.md`)} ${path.join(
      __dirname,
      '../',
      `compare/new/${fileName}.md`,
    )}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_error: any, stdout: any, _stderr: any) => {
      // success
      writeFileSync(`compare/diff/full-${fileName}.diff`, stdout)
      // eslint-disable-next-line no-console
      console.log(
        `\n\n====================`,
        `\n\nDiff for ${fileName}\n`,
        `\n${consolePassDiff || '\x1b[30mno significant changes\x1b[0m'}\n`,
        `\nSee \x1b[34mcompare/diff/full-${fileName}.diff\x1b[0m for detailed changelog`,
      )
      return
    },
  )
}
// Diff dark
diffFiles(`light_high_contrast`)
