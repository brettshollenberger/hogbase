#!/bin/bash
set -euo pipefail

# Optional: Run tests first
npm test

# Bump version
npm version patch

# Push changes and tags
git push && git push --tags

# Publish to npm
npm publish --access public
