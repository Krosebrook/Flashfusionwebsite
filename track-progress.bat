@echo off
REM Simple progress tracking - run this after any deployment

echo === Enterprise AI Progress Tracker ===
echo %date% %time% >> progress-log.txt

REM Count how many repos we've deployed to
echo Counting deployments...
set /a DEPLOYED=0
for /f %%i in ('dir /b /s mcp-server.js 2^>nul ^| find /c "mcp-server.js"') do set /a DEPLOYED=%%i

REM Count total repos to deploy to
set /a TOTAL=0
for /f %%i in ('type pending-repos.txt ^| find /c /v ""') do set /a TOTAL=%%i

REM Calculate percentage (roughly)
set /a PERCENT=DEPLOYED*100/TOTAL 2>nul || set PERCENT=0

echo === Progress Report ===
echo Deployed to: %DEPLOYED% repositories
echo Total to deploy: %TOTAL% repositories  
echo Progress: ~%PERCENT%%
echo.

REM Log this info
echo %date% %time%: Deployed=%DEPLOYED%, Total=%TOTAL%, Progress=%PERCENT%% >> progress-log.txt

REM Show what to do next
echo === What's Next? ===
if %PERCENT% LSS 25 (
    echo Focus: Deploy to more HIGH PRIORITY repos
    echo Command: ./scripts/deployment/deploy-all.sh Krosebrook 3
) else if %PERCENT% LSS 50 (
    echo Focus: Deploy to MEDIUM PRIORITY repos  
    echo Command: ./scripts/deployment/deploy-all.sh Krosebrook 5
) else if %PERCENT% LSS 75 (
    echo Focus: Deploy to remaining ACTIVE repos
    echo Command: ./scripts/deployment/deploy-all.sh Krosebrook 10
) else (
    echo 🎉 Great job! Most repos are deployed!
    echo Focus: Monitor and maintain existing deployments
)

echo.
echo Progress log saved to: progress-log.txt
echo Dashboard: Open simple-dashboard.html in your browser

pause