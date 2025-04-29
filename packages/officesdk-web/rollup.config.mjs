import path from 'path';
import { fileURLToPath } from 'url';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import esbuild from 'rollup-plugin-esbuild';
import alias from '@rollup/plugin-alias';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = 'src/index.ts';
const baseDist = '../../dist/web/umd';

export default [
  {
    input,
    output: {
      file: `${baseDist}/index.js`,
      format: 'umd',
      name: '@officesdk/web',
      sourcemap: false,
    },
    plugins: [
      resolve(),
      commonjs(),
      // typescript({ tsconfig: './tsconfig.rollup.json' }),
      esbuild({
        target: 'esnext', // 可根据需要改为 'es2015'
        sourceMap: false,
        tsconfig: './tsconfig.rollup.json',
      }),
      alias({
        entries: [
          { find: '@officesdk/rpc', replacement: path.resolve(__dirname, '../officesdk-rpc/src/index.ts') },
        ],
      }),
      terser(),
    ],
  },
];
