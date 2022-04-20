/**
 * platforms: CSS, js, ts, json
 * transforms:
 * - px to rem
 * - custom media queries (postcss)
 * - camel-kebab
 * - responsive tokens (same token, different value)
 */
const StyleDictionary = require('style-dictionary')
const {fileHeader, formattedVariables} = StyleDictionary.formatHelpers

const groupBy = (collection, iteratee = x => x) => {
  const it = typeof iteratee === 'function' ? iteratee : ({[iteratee]: prop}) => prop

  const array = Array.isArray(collection) ? collection : Object.values(collection)

  return array.reduce((r, e) => {
    const k = it(e)

    r[k] = r[k] || []

    r[k].push(e)

    return r
  }, {})
}

// REGISTER THE CUSTOM TRANFORMS

/**
 * transform: css variable names
 * example: `--namespace-item-variant-property-modifier`
 */
StyleDictionary.registerTransform({
  name: 'name/css',
  type: 'name',
  transformer: (token, options) => {
    return token.path.join('-')
  }
})

/**
 * transform: js variable names
 * example: `namespace.item.variant.property.modifier`
 */
StyleDictionary.registerTransform({
  name: 'name/js',
  type: 'name',
  transformer: (token, options) => {
    return token.path.join('.')
  }
})

/**
 * transform: js es6 variable names
 * example: `NamespaceItemVariantPropertyModifier`
 */
StyleDictionary.registerTransform({
  name: 'name/js/es6',
  type: 'name',
  transformer: (token, options) => {
    const tokenPath = token.path.join(' ')
    const tokenPathItems = tokenPath.split(' ')
    for (var i = 0; i < tokenPathItems.length; i++) {
      tokenPathItems[i] = tokenPathItems[i].charAt(0).toUpperCase() + tokenPathItems[i].slice(1)
    }
    const tokenName = tokenPathItems.join('')
    return tokenName
  }
})

// find values with px unit
function isPx(value) {
  return /[\d\.]+px$/.test(value)
}

// transform: px to rem
StyleDictionary.registerTransform({
  name: 'pxToRem',
  type: 'value',
  transformer: (token, options) => {
    if (isPx(token.value)) {
      const baseFontSize = 16
      const floatValue = parseFloat(token.value.replace('px', ''))

      if (isNaN(floatValue)) {
        return token.value
      }

      if (floatValue === 0) {
        return '0'
      }

      return `${floatValue / baseFontSize}rem`
    }
    return token.value
  }
})

//-----

// ts output
StyleDictionary.registerTransform({
  name: 'attribute/typescript',
  type: 'attribute',
  transformer: (token, options) => {
    return {
      typescript: {
        // these transforms will need to match the ones you use for typescript
        // or you can "chain" the transforms and use token.name and token.value
        // like scss and less transforms do.
        name: token.path.slice(1).join('.'),
        value: token.value
      }
    }
  }
})

// css output
StyleDictionary.registerTransform({
  name: 'attribute/css',
  type: 'attribute',
  transformer: token => {
    const tokenName = token.path.slice(1).join('-')
    return {
      css: {
        name: `--${tokenName}`,
        value: token.value
      }
    }
  }
})

// transform: composite typography to shorthands
StyleDictionary.registerTransform({
  name: 'typography/shorthand',
  type: 'value',
  transitive: true,
  matcher: token => token.type === 'typography',
  transformer: token => {
    const {value} = token
    return `${value.fontWeight} ${value.fontSize}/${value.lineHeight} ${value.fontFamily}`
  }
})

// REGISTER THE CUSTOM TRANFORM GROUPS

StyleDictionary.registerTransformGroup({
  name: 'css',
  transforms: ['name/css', 'pxToRem', 'typography/shorthand']
})

// REGISTER A CUSTOM FORMAT

// wrap mobile tokens in media query
StyleDictionary.registerFormat({
  name: 'css/touch-target-mobile',
  formatter: function({dictionary, file, options}) {
    const {outputReferences} = options
    return (
      fileHeader({file}) +
      `@media (pointer: coarse) { :root {\n` +
      formattedVariables({format: 'css', dictionary, outputReferences}) +
      '\n}}\n'
    )
  }
})

// wrap desktop tokens in media query
StyleDictionary.registerFormat({
  name: 'css/touch-target-desktop',
  formatter: function({dictionary, file, options}) {
    const {outputReferences} = options
    return (
      fileHeader({file}) +
      `@media (pointer: fine) { :root {\n` +
      formattedVariables({format: 'css', dictionary, outputReferences}) +
      '\n}}\n'
    )
  }
})

StyleDictionary.registerFormat({
  name: 'custom/format/custom-media',
  formatter(dictionary) {
    return dictionary.allProperties
      .map(prop => {
        const {value, path, name} = prop
        // const tokenPath = path
        // const tokenProperty = path[path.length - 1]
        return `@custom-media --${name}-viewport ${value};`
      })
      .join('\n')
  }
})

// format docs
StyleDictionary.registerFormat({
  name: 'json/docs',
  formatter: function(dictionary) {
    const groupedTokens = groupBy(dictionary.allProperties, 'filePath')

    return JSON.stringify(groupedTokens, null, 2)
  }
})

/**
 * Replacement format for javascript/module
 */
StyleDictionary.registerFormat({
  name: 'javascript/module-v2',
  formatter: function({dictionary, file}) {
    const recursiveleyFlattenDictionary = obj => {
      const tree = {}
      if (typeof obj !== 'object' || Array.isArray(obj)) {
        return obj
      }

      if (obj.hasOwnProperty('value')) {
        return obj.value
      } else {
        for (const name in obj) {
          if (obj.hasOwnProperty(name)) {
            tree[name] = recursiveleyFlattenDictionary(obj[name])
          }
        }
      }
      return tree
    }

    return (
      fileHeader({file}) +
      'module.exports = ' +
      JSON.stringify(recursiveleyFlattenDictionary(dictionary.tokens), null, 2)
    )
  }
})

/**
 * Replacement format for typescript/module-declarations
 * Type schema corresponds to javascript/module-v2 format
 */
StyleDictionary.registerFormat({
  name: 'typescript/module-declarations-v2',
  formatter: function({dictionary, options, file}) {
    const {moduleName = `tokens`} = options

    const getType = value => {
      switch (typeof value) {
        case 'string':
          return 'string'
        case 'number':
          return 'number'
        default:
          return 'any'
      }
    }

    const recursiveTypeGeneration = obj => {
      const tree = {}
      const shortHandSizes = ['large', 'medium', 'small']
      if (typeof obj !== 'object' || Array.isArray(obj)) {
        return obj
      }

      if (obj.hasOwnProperty('value') && typeof obj.value === 'string') {
        return getType(obj.value)
      } else {
        for (const name in obj) {
          if ((obj.hasOwnProperty(name) && obj.name === 'shorthand') || shortHandSizes.includes(obj.name)) {
            for (const shorthandKey in obj.value) {
              tree[shorthandKey] = getType(obj.value[shorthandKey])
            }
            return tree
          } else if (obj.hasOwnProperty(name)) {
            tree[name] = recursiveTypeGeneration(obj[name])
          }
        }
      }
      return tree
    }

    const output =
      fileHeader({file}) +
      `declare const ${moduleName}: ${JSON.stringify(recursiveTypeGeneration(dictionary.tokens), null, 2)}
 export default ${moduleName};`

    return output
      .replace(/"any"/g, 'any')
      .replace(/"string"/g, 'string')
      .replace(/"number"/g, 'number')
  }
})

module.exports = StyleDictionary
