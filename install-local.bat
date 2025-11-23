@echo off
echo ========================================
echo   ULima Backend - Instalacion Local
echo ========================================
echo.
echo Este script instala las dependencias
echo localmente para eliminar errores del IDE.
echo.
echo NOTA: El backend funciona en Docker sin
echo necesidad de esto. Solo es para mejorar
echo la experiencia del IDE.
echo.
pause

echo [1/2] Instalando dependencias...
call npm install

echo.
echo [2/2] Generando Prisma Client...
call npx prisma generate

echo.
echo ========================================
echo   Instalacion completada!
echo ========================================
echo.
echo Los errores de TypeScript en el IDE
echo deberian desaparecer ahora.
echo.

pause
