@echo off
REM Simple error detection you can run anytime

echo === Checking for Common Problems ===
echo.

REM Check if important services are running
echo Checking services...
netstat -an | findstr ":54323" > nul && (
    echo ✅ Supabase is running
) || (
    echo ❌ Supabase might be down - try: supabase start
)

REM Check GitHub connection
echo.
echo Checking GitHub...
gh auth status > nul 2>&1 && (
    echo ✅ GitHub connection OK
) || (
    echo ❌ GitHub connection problem - check your internet
)

REM Check for recent errors in logs
echo.
echo Checking recent errors...
if exist "logs\*.log" (
    findstr /i "error fail exception timeout" logs\*.log | find /c "error" > nul && (
        echo ⚠️ Found some errors in logs
        echo Recent errors:
        findstr /i "error fail exception" logs\*.log | tail -5
        echo.
        echo 💡 Check TROUBLESHOOTING.md for solutions
    ) || (
        echo ✅ No major errors found in logs
    )
) else (
    echo 💡 No log files found yet - that's normal for new setup
)

REM Check disk space
echo.
echo Checking disk space...
for /f "tokens=3" %%a in ('dir /-c ^| findstr "bytes free"') do set FREESPACE=%%a
echo Free space: %FREESPACE%
if %FREESPACE% LSS 1000000000 (
    echo ⚠️ Low disk space - clean up old files
) else (
    echo ✅ Plenty of disk space
)

REM Simple memory check
echo.
echo Checking if system is slow...
tasklist /fi "imagename eq node.exe" | find /c "node.exe" > temp_count.txt
set /p NODECOUNT=<temp_count.txt
del temp_count.txt

if %NODECOUNT% GTR 10 (
    echo ⚠️ Many Node processes running (%NODECOUNT%) - system might be slow
    echo 💡 Try restarting: enterprise-ai.sh stop then start-dev
) else (
    echo ✅ Normal number of processes running
)

echo.
echo === Summary ===
echo If you see ❌ or ⚠️ above, check TROUBLESHOOTING.md
echo If all ✅, your system is healthy!
echo.

pause