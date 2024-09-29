@echo off
echo Compiling TypeScript...
tsc
if %ERRORLEVEL% NEQ 0 (
    echo Compilation failed!
    exit /b %ERRORLEVEL%
)
echo Running compiled JavaScript...
node dist/index.js
pause