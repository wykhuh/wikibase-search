import adapter from '@sveltejs/adapter-static';
const dev = process.env.NODE_ENV === 'development';
import dsv from '@rollup/plugin-dsv';

const config = {
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'docs',
      assets: 'docs',
      fallback: null,
      precompress: false
    }),
    paths: {
      base: dev ? '' : '/wikibase-search'
    },
    prerender: {
      // This can be false if you're using a fallback (i.e. SPA mode)
      default: true
    },
    vite: {
      plugins: [dsv()]
    }
  }
};

export default config;
