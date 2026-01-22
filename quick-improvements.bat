@echo off
REM Quick improvements you can make right now

echo === Making your system more organized ===

REM Create a daily log file automatically
echo %date% %time%: System check started >> daily-operations.log

REM Make scripts executable (fixes permission issues)
echo Making scripts executable...
attrib +x scripts\deployment\*.sh
attrib +x scripts\monitoring\*.sh

REM Create backup of current state before any changes
echo Creating safety backup...
copy CURRENT-STATE.json "99-Archive\backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%.json"

REM Clean up old log files (keep system tidy)
echo Cleaning old logs...
forfiles /p logs /m *.log /d -7 /c "cmd /c del @path" 2>nul

REM Check if everything is working
echo === Quick Health Check ===
node --version && echo ✅ Node.js working || echo ❌ Node.js problem
python --version && echo ✅ Python working || echo ❌ Python problem
gh auth status && echo ✅ GitHub working || echo ❌ GitHub problem

echo.
echo === All done! ===
echo Your system is now more organized and cleaned up.
echo Check daily-operations.log for what happened today.

pause