@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PYTHON=C:\Users\10253\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if not exist "%PYTHON%" (
  where py >nul 2>nul
  if not errorlevel 1 set "PYTHON=py"
)

if not exist "%PYTHON%" if not "%PYTHON%"=="py" (
  where python >nul 2>nul
  if not errorlevel 1 set "PYTHON=python"
)

powershell -NoProfile -WindowStyle Hidden -Command "Start-Process -WindowStyle Hidden -FilePath '%PYTHON%' -ArgumentList '-m','http.server','8877','--bind','127.0.0.1' -WorkingDirectory '%~dp0'"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8877/"

echo.
echo IMPS 페이지를 브라우저에서 열었습니다.
echo 이 창은 닫아도 됩니다.
timeout /t 3 >nul
