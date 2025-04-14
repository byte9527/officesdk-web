import path from 'path'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const pkgName = path.basename(__dirname).replace('officesdk-', '') // rpc / web
const input = 'src/index.ts'
const outputDir = path.resolve(__dirname, '../dist', pkgName)

export default {
  input,
  output: [
    {
      file: `${outputDir}/umd/index.umd.js`,
      format: 'umd',
      name: `Officesdk${pkgName[0].toUpperCase()}${pkgName.slice(1)}`,
      sourcemap: true
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: `${outputDir}/types`,
      outDir: `${outputDir}/esm`, // 只控制 .js 输出位置，其他通过 output 配置分开处理
      rootDir: 'src'
    })
  ]
}