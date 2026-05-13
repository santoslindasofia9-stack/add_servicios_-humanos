@echo off
title TrustMarket Dev Server
echo Iniciando el servidor de TrustMarket...
cd /d "%~dp0"
:start
cmd /c npm run dev
echo.
echo El servidor se ha detenido de forma inesperada. Reiniciando en 5 segundos...
timeout /t 5
goto start
