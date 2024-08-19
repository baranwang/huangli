import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      autoExtension: true,
      autoExternal: true,
      output: {
        distPath: {
          root: './dist/esm',
        },
      },
    },
    {
      format: 'cjs',
      autoExtension: true,
      autoExternal: true,
      output: {
        distPath: {
          root: './dist/cjs',
        },
      },
      dts: { bundle: true, distPath: './dist/types' },
    },
  ],
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  output: {
    target: 'node',
  },
});
