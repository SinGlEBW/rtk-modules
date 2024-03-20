import { defineConfig } from 'vite'
import { extname, relative, resolve } from 'path'
import packageJson from './package.json';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob'

const namePackage = packageJson.name;
const entryPathLib = "src/lib"
export default defineConfig({
  plugins: [
    dts({ include: entryPathLib })
  ],
  server: {
    open: true
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, entryPathLib),
      formats: ['es'],
      name: namePackage,
    },
    rollupOptions: {
      external: ['@reduxjs/toolkit'],
      input: Object.fromEntries(
        glob.sync(entryPathLib + '/**/*.{ts,tsx}').map(file => [
          relative(
            entryPathLib,
            file.slice(0, file.length - extname(file).length)
          ),
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
        entryFileNames: '[name].js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          "styled-components": "styled"
        }
      }
    }
  },
})
