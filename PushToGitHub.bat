@echo off
cd /d "%~dp0"
echo ======================================================================
echo   PUSHING LUNAR CHESS TO https://github.com/kpvnsi/lunar-chess
echo ======================================================================
echo.
"%LOCALAPPDATA%\MinGit\cmd\git.exe" push -u origin main
echo.
echo ======================================================================
echo   DONE! Go to: https://github.com/kpvnsi/lunar-chess/actions
echo   to see your APK building in the cloud!
echo ======================================================================
pause