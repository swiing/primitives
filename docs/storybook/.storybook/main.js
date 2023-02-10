module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/react',
  refs: {
    'design-system': {
      title: 'Primer React',
      url: 'https://primer.style/react/storybook/',
      expanded: false, // optional, true by default
    },
  },
}
