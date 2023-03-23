import {isSource} from '~/src/filters'
import type StyleDictionary from 'style-dictionary'
import type {PlatformInitializer} from '~/src/types/PlatformInitializer'

const getCssSelectors = (outputFile: string): {selector: string; selectorLight: string; selectorDark: string} => {
  // check for dark in the beginning of the output filename
  const lastSlash = outputFile.lastIndexOf('/')
  const outputBasename = outputFile.substring(lastSlash + 1, outputFile.indexOf('.'))
  const themeName = outputBasename.replace(/-/g, '_')
  // const mode = outputBasename.substring(0, 4) === 'dark' ? 'dark' : 'light'

  return {
    selector: `[data-color-mode="light"][data-light-theme="${themeName}"], [data-color-mode="dark"][data-dark-theme="${themeName}"]`,
    selectorLight: `[data-color-mode="auto"][data-light-theme="${themeName}"]`,
    selectorDark: `[data-color-mode="auto"][data-dark-theme="${themeName}"]`,
  }
}

export const css: PlatformInitializer = (outputFile, prefix, buildPath, options): StyleDictionary.Platform => {
  const {selector, selectorLight, selectorDark} = getCssSelectors(outputFile)
  return {
    prefix,
    buildPath,
    transforms: [
      'name/pathToKebabCase',
      'color/hex',
      'color/hexAlpha',
      'color/hexMix',
      'shadow/css',
      'border/css',
      'typography/css',
      'fontFamily/css',
      'fontWeight/number',
    ],
    options: {
      basePxFontSize: 16,
    },
    files: [
      {
        destination: `${outputFile}`,
        format: `css/themed`,
        filter: token => isSource(token) && options?.themed === true,
        options: {
          outputReferences: false,
          selector,
          selectorLight,
          selectorDark,
        },
      },
      {
        destination: `${outputFile}`,
        format: `css/variables`,
        filter: token => isSource(token) && options?.themed !== true,
        options: {
          outputReferences: false,
        },
      },
    ],
  }
}
