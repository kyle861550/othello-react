import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import html from '@rollup/plugin-html';
import { defineConfig } from 'rollup';

const production = !process.env.ROLLUP_WATCH;

export default defineConfig({
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production
      }
    }),
    css({ output: 'bundle.css' }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    html({
      fileName: 'index.html',
      title: 'Svelte App',
      template: ({ attributes, files, meta, publicPath, title }) => {
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${title}</title>
              <link rel="stylesheet" href="${publicPath}${files.css[0].fileName}">
            </head>
            <body>
              <div id="app"></div>
              <script src="${publicPath}${files.js[0].fileName}"></script>
            </body>
          </html>
        `;
      }
    }),
    !production && livereload('public'),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
});
