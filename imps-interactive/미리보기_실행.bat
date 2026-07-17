@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PYTHON="
set "BUNDLED_PYTHON=C:\Users\10253\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

if exist "%BUNDLED_PYTHON%" set "PYTHON=%BUNDLED_PYTHON%"
if not defined PYTHON where py >nul 2>nul && set "PYTHON=py"
if not defined PYTHON where python >nul 2>nul && set "PYTHON=python"

if not defined PYTHON (
  echo Python을 찾지 못해 미리보기를 실행할 수 없습니다.
  pause
  exit /b 1
)

for /f %%P in ('powershell -NoProfile -Command "$listener=[System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback,0); $listener.Start(); $port=$listener.LocalEndpoint.Port; $listener.Stop(); $port"') do set "PORT=%%P"

powershell -NoProfile -WindowStyle Hidden -Command "Start-Process -WindowStyle Hidden -FilePath '%PYTHON%' -ArgumentList '-m','http.server','%PORT%','--bind','127.0.0.1' -WorkingDirectory '%~dp0'"

powershell -NoProfile -Command "$url='http://127.0.0.1:%PORT%/?v=' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds(); for($i=0; $i -lt 20; $i++){ try { Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1 ^| Out-Null; Start-Process $url; exit 0 } catch { Start-Sleep -Milliseconds 250 } }; exit 1"

echo.
echo 최신 로컬 페이지를 브라우저에서 열었습니다.
echo 이 창은 닫아도 됩니다.
timeout /t 3 >nul
