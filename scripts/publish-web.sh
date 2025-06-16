
#!/bin/bash
echo "version_bump: $VERSION_BUMP"
echo "GITHUB_REF = $GITHUB_REF"

get_version() {
  if [[ "${GITHUB_REF}" == refs/tags/v* ]]; then
    # Extract the version number from the tag
    VERSION="${GITHUB_REF#refs/tags/v}"

  else
    # Fetch all published versions from npm
    VERSIONS=$(npm view @officesdk/web versions --json || echo "[]")
    # echo "📦 existing vers $VERSIONS"
    # Find the latest version
    LATEST_VERSION=$(echo "$VERSIONS" | jq -r '.[]' | sort -rV | head -n1)

    # If no version is found, default to "0.0.0"
    if [[ -z "$LATEST_VERSION" ]]; then
      LATEST_VERSION="0.0.0"
    fi

    # Use "beta" tag for main branch, otherwise use "alpha"
    if [[ "$GITHUB_REF" == refs/heads/main ]]; then
      PRE_TAG="beta"
    else
      PRE_TAG="alpha"
    fi

    # If the latest version is already a pre-release (with alpha or beta tag)
    if [[ "$LATEST_VERSION" == *"-${PRE_TAG}."* ]]; then
      # Extract the base version and current pre-release number
      BASE_VERSION=$(echo "$LATEST_VERSION" | sed -E "s/-${PRE_TAG}\.[0-9]+$//")
      LATEST_NUM=$(echo "$LATEST_VERSION" | sed -E "s/.*-${PRE_TAG}\.([0-9]+)$/\1/")
      # Increment the pre-release number
      NEXT_NUM=$((LATEST_NUM + 1))
      VERSION="${BASE_VERSION}-${PRE_TAG}.${NEXT_NUM}"
    else
      # If not a pre-release, update the version based on VERSION_BUMP
      MAJOR=$(echo "$LATEST_VERSION" | cut -d. -f1)
      MINOR=$(echo "$LATEST_VERSION" | cut -d. -f2)
      PATCH=$(echo "$LATEST_VERSION" | cut -d. -f3)

      case "${VERSION_BUMP}" in
        major)
          # Increment major version, reset minor and patch
          MAJOR=$((MAJOR + 1))
          MINOR=0
          PATCH=0
          ;;
        minor)
          # Increment minor version, reset patch
          MINOR=$((MINOR + 1))
          PATCH=0
          ;;
        patch|*)
          # Increment patch version
          PATCH=$((PATCH + 1))
          ;;
      esac

      # Generate a new pre-release version
      VERSION="${MAJOR}.${MINOR}.${PATCH}-${PRE_TAG}.0"
    fi

    # Output the version number and npm tag
    echo "$VERSION"
  fi
}

get_tag() {
  REF=${GITHUB_REF:-$(git symbolic-ref -q HEAD || git describe --tags)}

  if [[ "$REF" == refs/tags/* ]]; then
    echo "latest"
  elif [[ "$REF" == refs/heads/master ]]; then
    echo "beta"
  else
    echo "alpha"
  fi
}

# Check if there are any changes in the directory
if git diff --name-only "$GIT_BEFORE" "$GIT_AFTER" | grep -q '^packages/officesdk-web/'; then
  echo "Changes detected in packages/officesdk-web."
else
  echo "No changes detected in packages/officesdk-web. Skipping publish."
  exit 0
fi

cd ./dist/web

 # If the current trigger is a Git tag with a version number
NEXT_VERSION=$(get_version)
echo "next_version: $NEXT_VERSION"

# Update the version number in package.json files
jq --arg v "$NEXT_VERSION" '.version = $v' dist/web/package.json > tmp.web.json && mv tmp.web.json dist/web/package.json
# Publish the package

RELEASE_TAG=$(get_tag)
npm publish --//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN  --tag "$RELEASE_TAG"
echo "Package @officesdk/web version $PACKAGE_VERSION published as $RELEASE_TAG ."


