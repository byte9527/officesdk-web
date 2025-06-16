if git diff --name-only 8f8528717de9f81d356bbbcaadf2065d668d1ce2 c916d1eb3f19a9964ce0da8d94e82d71b13c7d8f | grep -q '^packages/officesdk-rpc/'; then
  echo "Changes detected in packages/officesdk-rpc."
else
  echo "No changes detected in packages/officesdk-rpc. Skipping publish."
  exit 0
fi