import { build } from 'vite'
import { resolve } from 'node:path'
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'

const entries = ['index', 'overlay', 'cursor', 'tray']

const standaloneDir = resolve('out/preload-standalone')
const preloadDir = resolve('out/preload')

mkdirSync(preloadDir, { recursive: true })

for (const entry of entries) {
  console.log(`Building standalone preload: ${entry}`)

  await build({
    configFile: false,
    publicDir: false,
    build: {
      outDir: standaloneDir,
      emptyOutDir: false,
      sourcemap: true,
      minify: false,
      lib: {
        entry: resolve(`src/preload/${entry}.ts`),
        formats: ['cjs'],
        fileName: () => `${entry}.js`
      },
      rollupOptions: {
        external: ['electron'],
        output: { inlineDynamicImports: true }
      }
    }
  })

  const source = resolve(standaloneDir, `${entry}.js`)
  const destination = resolve(preloadDir, `${entry}.js`)

  const code = readFileSync(source, 'utf8')

  if (/require\s*\(\s*['"]\.\.?\//.test(code)) {
    throw new Error(`Preload ${entry} contains a relative require`)
  }

  copyFileSync(source, destination)
  console.log(`Installed standalone preload: ${destination}`)
}

console.log('All four standalone preloads installed successfully.')