#!/bin/bash

# 清理输出目录
clean() {
  echo "Cleaning build directories..."
  git clean -f -d -x ./dist ./.dts 
}

# 构建officesdk-rpc CommonJS
build_rpc_cjs() {
  echo "Building rpc module (CommonJS)..."
  npx tsc -p packages/officesdk-rpc/tsconfig.json --module commonjs --outDir ./dist/rpc/cjs --verbatimModuleSyntax false
}

# 构建officesdk-rpc ESM
build_rpc_esm() {
  echo "Building officesdk-rpc module (ESM)..."
  npx tsc -p packages/officesdk-rpc/tsconfig.json  --module esnext --outDir ./dist/rpc/esm
}

# 生成officesdk-rpc的类型声明
generate_dts_rpc() {
  echo "Generating DTS for officesdk-rpc..."
  npx tsc -p ./packages/officesdk-rpc/tsconfig.dts.json --outDir ./.dts/rpc --declaration --emitDeclarationOnly
}

# 构建officesdk-rpc模块（CJS、ESM 和 DTS）
build_rpc() {
  echo "Building officesdk-rpc module..."
  build_rpc_cjs
  build_rpc_esm
  generate_dts_rpc
}

# 运行 API 提取器
run_api_rpc() {
  echo "Running API Extractor for officesdk-rpc..."
  npx api-extractor run --local --verbose -c packages/officesdk-rpc/api-extractor.json
}

# 构建 API
build_rpc_api() {
  echo "Building API..."
  run_api_rpc
}

# 构建officesdk-web CommonJS
build_web_cjs() {
  echo "Building web module (CommonJS)..."
  npx tsc -p packages/officesdk-web/tsconfig.json --module commonjs --outDir ./dist/web/cjs --verbatimModuleSyntax false
}

# 构建officesdk-web ESM
build_web_esm() {
  echo "Building officesdk-web module (ESM)..."
  npx tsc -p packages/officesdk-web/tsconfig.json  --module esnext --outDir ./dist/web/esm
}

# 构建officesdk-rpc UMD
build_web_umd() {
  echo "Building officesdk-web module (umd)..."
  cd ./packages/officesdk-web
  npx rollup -c
  cd ../..
}

# 生成officesdk-web的类型声明
generate_dts_web() {
  echo "Generating DTS for officesdk-web..."
  npx tsc -p ./packages/officesdk-web/tsconfig.dts.json --outDir ./.dts/web --declaration --emitDeclarationOnly
}

# 构建officesdk-web模块（CJS、ESM 和 DTS）
build_web() {
  echo "Building officesdk-web module..."
  build_web_cjs
  build_web_esm
  build_web_umd
  generate_dts_web
}

# 运行 API 提取器
run_api_web() {
  echo "Running API Extractor for officesdk-web..."
  npx api-extractor run --local --verbose -c packages/officesdk-web/api-extractor.json
  npx api-extractor run --local --verbose -c packages/officesdk-web/api-extractor.server.json
}

# 构建 API
build_web_api() {
  echo "Building API..."
  run_api_web
}

# 主构建任务
build() {
  clean
  build_rpc
  build_rpc_api
  build_web
  build_web_api
}

# 运行主构建任务
build
