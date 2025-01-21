import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { defineConfig } from 'vite';
import vitePluginExternal from 'vite-plugin-external';

import pkg from './package.json';

const isESModule = process.env.BUILD_FORMAT === 'esm';

export default defineConfig({
  build: {
    target: 'modules',
    outDir: 'dist',
    minify: false,
    rollupOptions: {
      plugins: [
        getBabelOutputPlugin({
          allowAllFormats: true,
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: false,
                modules: false,
              },
            ],
          ],
        }),
      ],
      input: ['src/index.js'],
      output: [
        isESModule && {
          format: 'es',
          entryFileNames: '[name].js',
          dir: 'dist/esm',
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
        !isESModule && {
          format: 'cjs',
          entryFileNames: '[name].js',
          exports: 'named',
          dir: 'dist/lib',
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
      ].filter(Boolean),
    },
    lib: {
      entry: './src/index.js',
      formats: ['es', 'cjs'],
      cssFileName: 'style',
    },
  },
  plugins: [
    vitePluginExternal({
      externalizeDeps: Object.keys({
        ...pkg.dependencies,
        ...pkg.peerDependencies,
      }),
    }),
  ],
});
