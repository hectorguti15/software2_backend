@echo off
echo ========================================
echo   ULima Backend - Docker Setup
echo ========================================
echo.

echo [1/5] Deteniendo contenedores anteriores...
docker-compose down

echo.
echo [2/5] Construyendo imagen Docker...
docker-compose build

echo.
echo [3/5] Levantando servicios Docker...
docker-compose up -d

echo.
echo [4/5] Esperando a que los servicios esten listos...
timeout /t 15 /nobreak >nul

echo.
echo [5/5] Verificando estado de contenedores...
docker-compose ps

echo.
echo ========================================
echo   SIGUIENTE PASO:
echo ========================================
echo.
echo   Ejecuta: migrate-and-seed.bat
echo.
echo   O manualmente:
echo   docker exec -it ulima_api npm run migrate
echo   docker exec -it ulima_api npm run seed
echo.
echo   Para ver logs:
echo   docker-compose logs -f api
echo.
echo   Health check:
echo   http://localhost:3000/health
echo.
echo ========================================

pause
