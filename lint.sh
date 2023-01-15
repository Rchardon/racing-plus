#!/bin/bash

set -e # Exit on any errors

# Get the directory of this script:
# https://stackoverflow.com/questions/59895/getting-the-source-directory-of-a-bash-script-from-within
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

SECONDS=0

cd "$DIR"

# Step 1 - Use Prettier to check formatting.
npx prettier --check .

# Step 2 - Use ESLint to lint the TypeScript.
# We use "--max-warnings" so that any warnings will fail in CI.
npx eslint --max-warnings 0 .

# Step 3 - Use `isaac-xml-validator` to validate XML files.
# (Skip this step if Python is not currently installed for whatever reason.)
if command -v python &> /dev/null; then
  pip install isaac-xml-validator --upgrade
  isaac-xml-validator
fi

# Step 4 - Spell check every file using CSpell.
# We use "--no-progress" and "--no-summary" because we want to only output errors.
npx cspell --no-progress --no-summary

# Step 5 - Check for orphaned words.
bash "$DIR/check-orphaned-words.sh"

# Step 6 - Use xmllint to lint XML files.
# (Skip this step if xmllint is not currently installed for whatever reason.)
if command -v xmllint &> /dev/null; then
  find "$DIR/mod" -name "*.xml" -print0 | xargs -0 xmllint --noout
fi

# Step 7 - Check for unused imports.
# The "--error" flag makes it return an error code of 1 if unused exports are found.
npx ts-prune --error

# Step 8 - Check for base file updates.
bash "$DIR/check-file-updates.sh"

echo "Successfully linted in $SECONDS seconds."
