@echo off

echo "fix auto rebase and force LF end of line"

git config config.pull false
git config core.autocrlf false