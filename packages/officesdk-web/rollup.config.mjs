import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
// import dts from 'rollup-plugin-dts';

const input = 'src/index.ts';
const baseDist = '../../dist/web/umd';

export default [
  {
    input,
    output: {
      file: `${baseDist}/index.js`,
      format: 'umd',
      name: '@officesdk/web',
      sourcemap: false
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.rollup.json' }),
      terser()
    ]
  },
  // {
  //   input,
  //   output: {
  //     file: `${baseDist}/index.d.ts`,
  //     format: 'es',
  //   },
  //   plugins: [
  //     dts()
  //   ],
  // },
];
