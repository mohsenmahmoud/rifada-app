import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // GitHub Pages serves the site from /<repo>/, so every URL carries that
  // prefix. Set unconditionally rather than only for `build`, so that
  // `vite preview` reproduces production exactly — `preview` reports itself as
  // `serve`, so a command-conditional base would silently skip it and hide
  // subpath breakage until after deploy. Dev then runs at
  // localhost:5173/rifada-app/ (Vite redirects / to it).
  //
  // Every asset path in the app is built from `import.meta.env.BASE_URL`, so
  // this one setting carries the images too.
  //
  // `BASE_PATH` overrides it for a host that serves the site from its own
  // root — `BASE_PATH=./ npm run build` produces a folder that runs anywhere,
  // including straight off the filesystem.
  base: process.env.BASE_PATH ?? '/rifada-app/',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
