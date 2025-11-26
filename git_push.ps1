$repo = 'https://github.com/Bunny-08/EazyByts-Module-2-.git'

Write-Output "Using remote: $repo"

# Initialize git if not already
git init

# Replace origin remote (remove then add)
git remote remove origin 2>$null
git remote add origin $repo

# Ensure branch name
git branch -M main

# Stage changes
git add -A

# Commit if there are staged changes
$porcelain = git status --porcelain
if ($porcelain) {
  git commit -m "Convert project to React JS, add backend, enable trading"
} else {
  Write-Output "No changes to commit"
}

# Push to remote (may prompt for credentials)
git push -u origin main
