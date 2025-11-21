@echo off
REM Simple HTTP Server for testing
REM This script requires PowerShell 5.0+

echo Iniciando servidor HTTP na porta 8080...
echo Acesse: http://localhost:8080/livro.html
echo.

REM Change to the directory and start a simple HTTP server
cd /d "%CD%"
powershell -NoProfile -Command ^
  "$listener = New-Object Net.HttpListener;" ^
  "$listener.Prefixes.Add('http://+:8080/');" ^
  "$listener.Start();" ^
  "Write-Host 'Servidor rodando em http://localhost:8080';" ^
  "while($listener.IsListening) {" ^
    "$context = $listener.GetContext();" ^
    "$path = $context.Request.RawUrl -replace '^/', '';" ^
    "if([string]::IsNullOrEmpty($path)) { $path = 'livro.html' };" ^
    "$filePath = Join-Path $PSScriptRoot $path;" ^
    "if(Test-Path $filePath) {" ^
      "$content = Get-Content $filePath -Raw;" ^
      "$context.Response.ContentType = 'text/html; charset=utf-8';" ^
      "$bytes = [System.Text.Encoding]::UTF8.GetBytes($content);" ^
      "$context.Response.OutputStream.Write($bytes, 0, $bytes.Length);" ^
    "}" ^
    "$context.Response.Close();" ^
  "}"
