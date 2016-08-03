@echo off
git add -A
set /p var1="Enter Commit Message: "
git commit -am "%var1%"
git push
pause