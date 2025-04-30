import path from 'path';
import { fileURLToPath } from 'url';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';

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
      typescript({
        tsconfig: './tsconfig.rollup.json',
        target: 'es5',
      }),
      alias({
        entries: [{ find: '@officesdk/rpc', replacement: path.resolve(__dirname, '../../dist/rpc/esm/index.js') }],
      }),
      terser(),
    ],
  },
];
