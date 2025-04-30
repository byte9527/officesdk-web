#!/bin/bash

# Clean output directories
clean() {
  echo "Cleaning build directories..."
  git clean -f -d -x ./dist ./.dts 
}

# Build officesdk-rpc CommonJS
build_rpc_cjs() {
  echo "Building rpc module (CommonJS)..."
  npx tsc -p packages/officesdk-rpc/tsconfig.json --module commonjs --outDir ./dist/rpc/cjs --verbatimModuleSyntax false
}

# Build officesdk-rpc ESM
build_rpc_esm() {
  echo "Building officesdk-rpc module (ESM)..."
  npx tsc -p packages/officesdk-rpc/tsconfig.json  --module esnext --outDir ./dist/rpc/esm
}

# Generate type declarations for officesdk-rpc
generate_dts_rpc() {
  echo "Generating DTS for officesdk-rpc..."
  npx tsc -p ./packages/officesdk-rpc/tsconfig.dts.json --outDir ./.dts/rpc --declaration --emitDeclarationOnly
}

# Build officesdk-rpc module (CJS, ESM, and DTS)
build_rpc() {
  echo "Building officesdk-rpc module..."
  build_rpc_cjs
  build_rpc_esm
  generate_dts_rpc
}

# Run API Extractor for officesdk-rpc
run_api_rpc() {
  echo "Running API Extractor for officesdk-rpc..."
  npx api-extractor run --local --verbose -c packages/officesdk-rpc/api-extractor.json
}

# Build API for officesdk-rpc
build_rpc_api() {
  echo "Building API..."
  run_api_rpc
}

# Build officesdk-web CommonJS
build_web_cjs() {
  echo "Building web module (CommonJS)..."
  npx tsc -p packages/officesdk-web/tsconfig.json --module commonjs --outDir ./dist/web/cjs --verbatimModuleSyntax false
}

# Build officesdk-web ESM
build_web_esm() {
  echo "Building officesdk-web module (ESM)..."
  npx tsc -p packages/officesdk-web/tsconfig.json  --module esnext --outDir ./dist/web/esm
}

# Build officesdk-web UMD
build_web_umd() {
  echo "Building officesdk-web module (UMD)..."
  cd ./packages/officesdk-web
  npx rollup -c
  cd ../..
}

# Generate type declarations for officesdk-web
generate_dts_web() {
  echo "Generating DTS for officesdk-web..."
  npx tsc -p ./packages/officesdk-web/tsconfig.dts.json --outDir ./.dts/web --declaration --emitDeclarationOnly
}

# Build officesdk-web module (CJS, ESM, UMD, and DTS)
build_web() {
  echo "Building officesdk-web module..."
  build_web_cjs
  build_web_esm
  build_web_umd
  generate_dts_web
}

# Run API Extractor for officesdk-web
run_api_web() {
  echo "Running API Extractor for officesdk-web..."
  npx api-extractor run --local --verbose -c packages/officesdk-web/api-extractor.json
  npx api-extractor run --local --verbose -c packages/officesdk-web/api-extractor.server.json
}

# Build API for officesdk-web
build_web_api() {
  echo "Building API..."
  run_api_web
}

# Main build task
build() {
  clean
  build_rpc
  build_rpc_api
  build_web
  build_web_api
}

# Run the main build task
build