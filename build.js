/**
 * platforms: CSS, js, ts, json
 * transforms:
 * - px to rem
 * - custom media queries (postcss)
 * - camel-kebab
 * - responsive tokens (same token, different value)
 */
//const glob = require('glob')
const glob = require('fast-glob')

const StyleDictionary = require('./TokenConvertor')
const transforms = require('style-dictionary/lib/common/transforms')
const _ = require('lodash')

const process = require('process')

function build() {
  const hasOptionalNamespace = process.argv.find(line => line.includes('--namespace'))
  const namespace = hasOptionalNamespace ? hasOptionalNamespace.split('=')[1] : 'primer'

  console.log('Build started...')
  console.log('\n==============================================')

  const customParseConfig = {
    parsers: [
      {
        pattern: /\.json$/,
        parse: ({contents, filePath}) => {
          try {
            let mutableContent = JSON.stringify(contents)

            if (filePath.includes('/functional/')) {
              mutableContent = mutableContent.replace(/<namespace>/g, namespace)
            }

            const parsed = JSON.parse(mutableContent)

            return JSON.parse(parsed)
          } catch (error) {
            console.log(error)
          }
        }
      }
    ]
  }

  const getConfig = (files, include) => {
    const config = {
      ...{include: include ? [include] : undefined},
      source: files,
      ...customParseConfig,
      platforms: {
        css: {
          buildPath: 'tokens-v2-private/css/',
          transformGroup: 'css',
          // map the array of token file paths to style dictionary output files
          files: files.map(filePath => {
            return {
              format: `css/variables`,
              destination: filePath.replace(`.json`, `.css`),
              filter: token => token.filePath === filePath,
              options: {
                outputReferences: true
              }
            }
          })
        },
        cssViewport: {
          buildPath: 'tokens-v2-private/css/tokens/functional/size/',
          transformGroup: 'css',
          files: [
            {
              filter: token => token.filePath.includes('viewport'),
              format: 'custom/format/custom-media',
              destination: 'viewport.css'
            }
          ]
        },
        js: {
          buildPath: 'tokens-v2-private/js/',
          transforms: ['name/js/es6', 'pxToRem'],
          // map the array of token file paths to style dictionary output files
          files: files.map(filePath => {
            return {
              format: `javascript/es6`,
              destination: filePath.replace(`.json`, `.js`),
              filter: token => token.filePath === filePath
            }
          })
        },
        jsModule: {
          buildPath: 'tokens-v2-private/js/module/',
          transforms: ['pxToRem'],
          // map the array of token file paths to style dictionary output files
          files: files.map(filePath => {
            return {
              format: `javascript/module`,
              destination: filePath.replace(`.json`, `.js`),
              filter: token => token.filePath === filePath
            }
          })
        },
        tsTypes: {
          buildPath: 'tokens-v2-private/ts/',
          transforms: ['pxToRem'],
          // map the array of token file paths to style dictionary output files
          files: files.map(filePath => {
            return {
              format: `typescript/module-declarations-v2`,
              destination: filePath.replace(`.json`, `.d.ts`),
              filter: token => token.filePath === filePath
            }
          })
        },
        ts: {
          buildPath: 'tokens-v2-private/ts/',
          transforms: ['pxToRem'],
          // map the array of token file paths to style dictionary output files
          files: files.map(filePath => {
            return {
              format: `javascript/module-v2`,
              destination: filePath.replace(`.json`, `.js`),
              filter: token => token.filePath === filePath
            }
          })
        },
        docs: {
          buildPath: 'tokens-v2-private/docs/',
          transformGroup: 'css',
          files: [
            {
              format: 'json/docs',
              destination: 'docValues.json',
              options: {
                outputReferences: false
              }
            }
          ]
        }
      }
    }
    return config
  }

  //build all tokens
  StyleDictionary.extend({
    ...getConfig(glob.sync([`tokens/**/*.json`, `!tokens/**/size-*.json`]))
  }).buildAllPlatforms()

  StyleDictionary.extend({
    ...getConfig([`tokens/functional/size/size-fine.json`], `tokens/base/size/size.json`)
  }).buildAllPlatforms()

  StyleDictionary.extend({
    ...getConfig([`tokens/functional/size/size-coarse.json`], `tokens/base/size/size.json`)
  }).buildAllPlatforms()

  // build desktop tokens
  StyleDictionary.extend({
    source: [`tokens/base/size/size.json`, `tokens/functional/size/size-fine.json`],
    ...customParseConfig,
    platforms: {
      css: {
        buildPath: 'tokens-v2-private/css/',
        transformGroup: 'css',
        files: [
          {
            destination: `tokens/functional/size/size-fine.css`,
            format: `css/touch-target-desktop`,
            filter: token => token.filePath.includes('fine'),
            options: {
              outputReferences: true
            }
          }
        ]
      }
    }
  }).buildAllPlatforms()

  // build mobile tokens
  StyleDictionary.extend({
    source: [`tokens/base/size/size.json`, `tokens/functional/size/size-coarse.json`],
    ...customParseConfig,
    platforms: {
      css: {
        buildPath: 'tokens-v2-private/css/',
        transformGroup: 'css',
        files: [
          {
            destination: `tokens/functional/size/size-coarse.css`,
            format: `css/touch-target-mobile`,
            filter: token => token.filePath.includes('coarse'),
            options: {
              outputReferences: true
            }
          }
        ]
      }
    }
  }).buildAllPlatforms()

  console.log('\n==============================================')
  console.log('\nBuild completed!')
}

// run immediately for internal use
build()

// exported for self-serve
module.exports = build
