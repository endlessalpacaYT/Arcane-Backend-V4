@echo off
setlocal

set /p package="Enter the npm package you want to install: "

echo Installing %package%...
npm i %package%
pause
