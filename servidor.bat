@echo off
echo Servidor HTTP local rodando em http://localhost:8080
echo Pressione CTRL+C para parar.
python -m http.server 8080
pause
