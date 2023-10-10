import React from 'react'
import {ColorScale} from '../../StorybookComponents/ColorScale/ColorScale'

export default {
  title: 'Color/Presentational',
  parameters: {
    controls: {hideNoControlsWarning: true},
  },
}

const bgColors = [
  'color-presentational-gray-0',
  'color-presentational-gray-1',
  'color-presentational-gray-2',
  'color-presentational-gray-3',
  'color-presentational-gray-4',
  'color-presentational-gray-5',
  'color-presentational-gray-6',
  'color-presentational-gray-7',
  'color-presentational-gray-8',
  'color-presentational-gray-9',
  'color-presentational-blue-0',
  'color-presentational-blue-1',
  'color-presentational-blue-2',
  'color-presentational-blue-3',
  'color-presentational-blue-4',
  'color-presentational-blue-5',
  'color-presentational-blue-6',
  'color-presentational-blue-7',
  'color-presentational-blue-8',
  'color-presentational-blue-9',
  'color-presentational-green-0',
  'color-presentational-green-1',
  'color-presentational-green-2',
  'color-presentational-green-3',
  'color-presentational-green-4',
  'color-presentational-green-5',
  'color-presentational-green-6',
  'color-presentational-green-7',
  'color-presentational-green-8',
  'color-presentational-green-9',
  'color-presentational-yellow-0',
  'color-presentational-yellow-1',
  'color-presentational-yellow-2',
  'color-presentational-yellow-3',
  'color-presentational-yellow-4',
  'color-presentational-yellow-5',
  'color-presentational-yellow-6',
  'color-presentational-yellow-7',
  'color-presentational-yellow-8',
  'color-presentational-yellow-9',
  'color-presentational-orange-0',
  'color-presentational-orange-1',
  'color-presentational-orange-2',
  'color-presentational-orange-3',
  'color-presentational-orange-4',
  'color-presentational-orange-5',
  'color-presentational-orange-6',
  'color-presentational-orange-7',
  'color-presentational-orange-8',
  'color-presentational-orange-9',
  'color-presentational-red-0',
  'color-presentational-red-1',
  'color-presentational-red-2',
  'color-presentational-red-3',
  'color-presentational-red-4',
  'color-presentational-red-5',
  'color-presentational-red-6',
  'color-presentational-red-7',
  'color-presentational-red-8',
  'color-presentational-red-9',
  'color-presentational-purple-0',
  'color-presentational-purple-1',
  'color-presentational-purple-2',
  'color-presentational-purple-3',
  'color-presentational-purple-4',
  'color-presentational-purple-5',
  'color-presentational-purple-6',
  'color-presentational-purple-7',
  'color-presentational-purple-8',
  'color-presentational-purple-9',
  'color-presentational-pink-0',
  'color-presentational-pink-1',
  'color-presentational-pink-2',
  'color-presentational-pink-3',
  'color-presentational-pink-4',
  'color-presentational-pink-5',
  'color-presentational-pink-6',
  'color-presentational-pink-7',
  'color-presentational-pink-8',
  'color-presentational-pink-9',
  'color-presentational-coral-0',
  'color-presentational-coral-1',
  'color-presentational-coral-2',
  'color-presentational-coral-3',
  'color-presentational-coral-4',
  'color-presentational-coral-5',
  'color-presentational-coral-6',
  'color-presentational-coral-7',
  'color-presentational-coral-8',
  'color-presentational-coral-9',
]

export const AllScales = () => {
  return (
    <div className="ColorScale--grid">
      <Gray />
      <Blue />
      <Green />
      <Yellow />
      <Orange />
      <Red />
      <Purple />
      <Pink />
      <Coral />
      <Black />
      <White />
    </div>
  )
}

export const Gray = () => {
  const grayColors = bgColors.filter(color => color.includes('gray'))
  return (
    <div>
      {grayColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Gray.tags = ['excludeSnapshot']

export const Blue = () => {
  const blueColors = bgColors.filter(color => color.includes('blue'))
  return (
    <div>
      {blueColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Blue.tags = ['excludeSnapshot']

export const Green = () => {
  const greenColors = bgColors.filter(color => color.includes('green'))
  return (
    <div>
      {greenColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Green.tags = ['excludeSnapshot']

export const Yellow = () => {
  const yellowColors = bgColors.filter(color => color.includes('yellow'))
  return (
    <div>
      {yellowColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Yellow.tags = ['excludeSnapshot']

export const Orange = () => {
  const orangeColors = bgColors.filter(color => color.includes('orange'))
  return (
    <div>
      {orangeColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Orange.tags = ['excludeSnapshot']

export const Red = () => {
  const redColors = bgColors.filter(color => color.includes('red'))
  return (
    <div>
      {redColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Red.tags = ['excludeSnapshot']

export const Purple = () => {
  const purpleColors = bgColors.filter(color => color.includes('purple'))
  return (
    <div>
      {purpleColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Purple.tags = ['excludeSnapshot']

export const Pink = () => {
  const pinkColors = bgColors.filter(color => color.includes('pink'))
  return (
    <div>
      {pinkColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Pink.tags = ['excludeSnapshot']

export const Coral = () => {
  const coralColors = bgColors.filter(color => color.includes('coral'))
  return (
    <div>
      {coralColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Coral.tags = ['excludeSnapshot']

export const Black = () => {
  const blackColors = bgColors.filter(color => color.includes('black'))
  return (
    <div>
      {blackColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
Black.tags = ['excludeSnapshot']

export const White = () => {
  const whiteColors = bgColors.filter(color => color.includes('white'))
  return (
    <div>
      {whiteColors.map(color => (
        <>
          <ColorScale color={color} key={color} />
        </>
      ))}
    </div>
  )
}
White.tags = ['excludeSnapshot']
