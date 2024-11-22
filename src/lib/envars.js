// https://timdeschryver.dev/blog/environment-variables-with-sveltekit#the-workaround
export const envars = {
  wbUrl: import.meta.env.VITE_WB_URL,
  wikiDemoApi: import.meta.env.VITE_WIKI_DEMO_API
};
