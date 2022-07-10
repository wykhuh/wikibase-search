// https://flaming.codes/posts/custom-lib-folder-with-path-alias-in-sveltekit
// https://stackoverflow.com/questions/70801691/vitetest-failed-to-resolve-import-lib-stores-store
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  }
});
