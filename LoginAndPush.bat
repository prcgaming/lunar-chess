@echo off
cd /d "%~dp0"
cls
echo ======================================================================
echo                LUNAR CHESS - AUTOMATIC GITHUB UPLOADER
echo ======================================================================
echo.
echo 1. A browser window will open asking you to confirm your GitHub login.
echo 2. You will see a one-time code on screen (like ABCD-1234).
echo 3. Just enter that code in your browser and click Authorize!
echo.
echo ======================================================================
echo.
"%LOCALAPPDATA%\gh\gh.exe" auth login --web -h github.com -p https
echo.
echo Setting up Git credentials...
"%LOCALAPPDATA%\gh\gh.exe" auth setup-git
echo.
echo Pushing Lunar Chess files to https://github.com/kpvnsi/lunar-chess ...
"%LOCALAPPDATA%\MinGit\cmd\git.exe" push -u origin main
echo.
echo ======================================================================
echo   SUCCESS! All files uploaded to https://github.com/kpvnsi/lunar-chess
echo   
echo   Now open: https://github.com/kpvnsi/lunar-chess/actions
echo   to watch your APK build and download it!
echo ======================================================================
echo.
pause