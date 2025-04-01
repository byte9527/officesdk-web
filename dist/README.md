# Distribution Directory

This directory is used for npm package publishing. Please do not manually modify any files here except `package.json`.
Build artifacts that need to be published will be output to this directory during the build process, working together with `package.json` for publishing.

## Directory Structure

* `web/` - Build artifacts from `packages/officesdk-web`
* `rpc/` - Build artifacts from `packages/officesdk-rpc`

## Build

```bash
yarn build
```

## Publish

```bash
yarn publish
```
