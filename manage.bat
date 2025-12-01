@echo off
chcp 65001 > nul
:menu
cls
echo ========================================
echo    CV APPLICATION MANAGEMENT
echo ========================================
echo.
echo [1] Start Production
echo [2] Start Development
echo [3] Stop All
echo [4] Restart
echo [5] View Logs
echo [6] Check Status
echo [7] Clean System
echo [8] Exit
echo.
set /p choice="Select option [1-8]: "

if "%choice%"=="1" goto start_prod
if "%choice%"=="2" goto start_dev
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto restart
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto status
if "%choice%"=="7" goto clean
if "%choice%"=="8" goto exit

echo Invalid choice! Please try again.
pause
goto menu

:start_prod
call start.bat
goto menu

:start_dev
call start-dev.bat
goto menu

:stop
call stop.bat
goto menu

:restart
call restart.bat
goto menu

:logs
call logs.bat
goto menu

:status
call status.bat
goto menu

:clean
docker system prune -a -f
echo System cleaned successfully!
pause
goto menu

:exit
echo Goodbye!
pause
exit