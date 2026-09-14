@echo off
REM Scan src\post markdown and img\gallery images, then regenerate
REM posts.js / gallery.js manifests used by the website.
REM Double-click this file to rebuild the blog list and gallery list.
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build-blog.ps1"
echo.
pause
