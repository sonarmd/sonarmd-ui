/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: '{src/components/**/*.stories.tsx,docs/stories/**/*.stories.tsx}',
  addons: {
    theme: {
      enabled: true,
      defaultState: 'light',
    },
    width: {
      enabled: true,
      options: {
        sm: 375,
        md: 768,
        'desktop-3col': 1440,
      },
      defaultState: 0,
    },
    a11y: {enabled: true},
    control: {enabled: true},
  },
  viteConfig: 'vite.config.ts',
};
