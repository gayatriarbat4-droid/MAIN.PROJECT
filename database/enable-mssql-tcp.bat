@echo off
:: Batch wrapper to request Administrator elevation and run enable-mssql-tcp.ps1
net session >nul 2>&1
if %errorLevel% == 0 (
    powershell.exe -ExecutionPolicy Bypass -File "%~dp0enable-mssql-tcp.ps1"
    pause
) else (
    echo Requesting Administrator privileges...
    powershell.exe -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
)
