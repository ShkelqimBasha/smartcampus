@echo off
title SMARTCAMPUS - Nisja e Aplikacionit
echo ========================================================
echo        🎓 SMARTCAMPUS - Sherbime Universitare
echo ========================================================
echo.
echo 1. Duke hapur serverin Backend ne porten 5000...
start "SMARTCAMPUS Backend" cmd /k "cd backend && npm run dev"

echo 2. Duke hapur serverin Frontend ne porten 3000...
start "SMARTCAMPUS Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo ✅ Te dy serverat u nisen me sukses!
echo - Backend API:  http://localhost:5000/api
echo - Frontend Web: http://localhost:3000
echo ========================================================
echo.

