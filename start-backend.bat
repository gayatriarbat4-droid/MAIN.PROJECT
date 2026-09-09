@echo off
setlocal
cd /d "%~dp0backend"

echo ===================================================
echo     MediCare Backend Launcher (Port 8081)
echo ===================================================

:: Check if SQL Server is listening on port 1433
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$t = New-Object System.Net.Sockets.TcpClient; try { $t.Connect('127.0.0.1', 1433); exit 0 } catch { exit 1 }"
if %errorLevel% equ 0 (
    echo [OK] Microsoft SQL Server is active on port 1433!
    echo Starting with MSSQL production profile...
    "C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.1\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
) else (
    echo [INFO] SQL Server port 1433 is not active yet.
    echo (To use SQL Server Express: right-click database\enable-mssql-tcp.bat and select 'Run as administrator')
    echo.
    echo Starting backend with In-Memory Dev Profile (H2)...
    "C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.1\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run "-Dspring-boot.run.profiles=dev"
)

pause
