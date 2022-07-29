// https://timdeschryver.dev/blog/environment-variables-with-sveltekit#the-workaround
export const envars = {
  apiPassword: import.meta.env.VITE_API_PASSWORD,
  apiUser: import.meta.env.VITE_API_USER,
  apiUrl: import.meta.env.VITE_API_URL,
  jwtDomain: import.meta.env.VITE_JWT_DOMAIN,
  useWikibase: import.meta.env.VITE_USE_WIKIBASE == 'true',
  wikiDemoApi: import.meta.env.VITE_WIKI_DEMO_API
};
