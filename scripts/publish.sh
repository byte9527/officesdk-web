#!/bin/bash

set -xe

publish() {

# Build if not already built
  if [ ! -f "dist/.build_executed" ]; then
    # Clone the repository with depth 1
    if [ -d "npm-publish" ]; then
      echo "npm-publish directory already exists."
    else
      # Clone the repository with depth 1
      git clone --depth 1 git@git.shimo.im:npm-registry/npm-publish.git
    fi

    # Change directory to the cloned repository
    cd npm-publish

    # Execute the register-npm-user.sh script
    . ./register-npm-user.sh

    # Login npm
    register_npm_user

    # Get back to project root
    cd ../

    # Echo the version message 
    echo -e "Publishing $name@$version ..."
  
    # build
    yarn build

    # 
    touch dist/.build_executed
  fi

  cd $PROJECT_PATH
  
  # Read `files` from package.json
  files=$(jq -r '.files' package.json)

  # Check build files
  for file in $(echo "$files" | jq -r '.[]'); do
      if [ ! -e "$file" ]; then
          echo "Error: File or directory '$file' specified in files field does not exist."
          exit 1
      fi
  done

  # Publish npm
  npm publish

  set +x

  # TODO: push tag to git
}

warning() {
  CYAN='\033[0;36m'
  NC='\033[0m'
  
  # Echo the warning message in red
  echo -e "${CYAN}Version $name@$version is already published on npm.${NC}"
}

# Check if $PROJECT_PATH variable is set
if [ -z "$PROJECT_PATH" ]; then
  echo "Error: PROJECT_PATH variable is not set."
  exit 1
fi

# Read version from package.json
version=$(node -p "require('$PROJECT_PATH/package.json').version")
name=$(node -p "require('$PROJECT_PATH/package.json').name")

# Check if the version is published on npm
if [ -z "$(npm view $name@$version version)" ] || [ $? -eq 0 ]; then
  (
    publish
  )
else
  warning
fi
