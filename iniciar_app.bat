@echo off
color 0b
echo ====================================================
echo        INICIANDO EMOCIONOMETRO (LIMBICO)
echo ====================================================
echo.

echo Iniciando Backend (Servidor Socket.io)...
start "Emocionometro - Servidor" cmd /k "cd server && npm run dev"

echo Iniciando Frontend (React/Vite) exponiendolo a la red local...
start "Emocionometro - Cliente" cmd /k "cd client && npm run dev -- --host"

echo.
echo ====================================================
echo  ¡Listo! Se han abierto dos ventanas negras (consolas).
echo  No las cierres mientras uses la aplicacion.
echo.
echo  Para ver la vista de USUARIO entra a:
echo  http://localhost:5173
echo.
echo  Para ver la vista de ADMINISTRADOR entra a:
echo  http://localhost:5173/admin
echo ====================================================
pause
