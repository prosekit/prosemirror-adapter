import { readFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { BuildOptions, UserConfig } from 'vite'
import { defineConfig } from 'vite'

import globalPackageJson from './package.json'

export const libFileName = (format: string) => `index.${format}.js`

function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item && typeof item === 'object' && !Array.isArray(item))
}

function mergeDeep<T>(target: T, ...sources: T[]): T {
  if (sources.length === 0)
    return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key])
          Object.assign(target, { [key]: {} })
        mergeDeep(target[key] as T, source[key] as T)
      }
      else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

const externals = [
  'svelte/store',
  /^lit/,
]

function viteBuild(path: string, options: BuildOptions = {}): BuildOptions {
  const dir = dirname(fileURLToPath(path))
  const packageDirName = basename(dir)

  const packageJson = JSON.parse(readFileSync(resolve(dir, 'package.json'), { encoding: 'utf-8' }))
  const deps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
    ...(packageJson.peerDependencies || {}),
    ...(globalPackageJson.dependencies || {}),
  }
  return mergeDeep<BuildOptions>(
    {
      sourcemap: true,
      emptyOutDir: false,
      lib: {
        entry: resolve(dir, 'src', 'index.ts'),
        name: `prosemirror-adapter_${packageDirName}`,
        fileName: libFileName,
        formats: ['es'],
      },
      rollupOptions: {
        external: [...Object.keys(deps), ...externals],
        output: {
          dir: resolve(dir, 'lib'),
        },
      },
    },
    options,
  )
}

export function viteConfigFactory(packageDirName: string, options: UserConfig = {}) {
  return defineConfig({
    ...options,
    build: viteBuild(packageDirName, options.build),
  })
}
