@echo off
echo ========================================
echo   ULima Backend - Test de Endpoints
echo ========================================
echo.

echo [1/5] Health Check...
curl http://localhost:3000/health
echo.
echo.

echo [2/5] Obtener Menu...
curl http://localhost:3000/api/menu
echo.
echo.

echo [3/5] Obtener Usuarios...
curl http://localhost:3000/api/usuarios
echo.
echo.

echo [4/5] Obtener Usuario Actual...
curl http://localhost:3000/api/usuarios/actual
echo.
echo.

echo [5/5] Estado de Contenedores...
docker-compose ps

echo.
echo ========================================
echo   Tests completados!
echo ========================================
echo.

pause
