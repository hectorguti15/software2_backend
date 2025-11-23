@echo off
echo ========================================
echo   ULima Backend - Migraciones y Seed
echo ========================================
echo.

echo [1/2] Ejecutando migraciones...
docker exec -it ulima_api npm run migrate

echo.
echo [2/2] Poblando base de datos...
docker exec -it ulima_api npm run seed

echo.
echo ========================================
echo   Setup completado!
echo ========================================
echo.
echo   API disponible en: http://localhost:3000
echo   Health check: http://localhost:3000/health
echo.

pause
