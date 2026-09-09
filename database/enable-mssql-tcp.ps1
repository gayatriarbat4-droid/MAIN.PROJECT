# Run as Administrator
Write-Host "Configuring SQL Server Express for MediCare..." -ForegroundColor Cyan

# 1. Enable Mixed Mode Authentication (SQL Server and Windows Authentication)
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer" -Name "LoginMode" -Value 2

# 2. Enable TCP/IP Protocol
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp" -Name "Enabled" -Value 1

# 3. Configure Port 1433 on IPAll
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp\IPAll" -Name "TcpPort" -Value "1433"
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp\IPAll" -Name "TcpDynamicPorts" -Value ""

# 4. Enable and start SQL Server Browser
Set-Service -Name "SQLBrowser" -StartupType Automatic -ErrorAction SilentlyContinue
Start-Service -Name "SQLBrowser" -ErrorAction SilentlyContinue

# 5. Restart SQL Server Service to apply changes
Write-Host "Restarting SQL Server (SQLEXPRESS)..." -ForegroundColor Yellow
Restart-Service -Name "MSSQL`$SQLEXPRESS" -Force

Write-Host "SQL Server Express successfully configured on port 1433 with Mixed Mode authentication!" -ForegroundColor Green
