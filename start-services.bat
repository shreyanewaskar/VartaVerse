@echo off
echo Starting VartaVerse Services...

echo.
echo Starting MySQL...
start "MySQL" cmd /k "echo MySQL should be running on port 3306"

echo.
echo Starting UserService...
cd "Backend\UserService\UserService"
start "UserService" cmd /k "mvn spring-boot:run"
cd ..\..\..

echo.
echo Waiting 10 seconds for UserService to start...
timeout /t 10 /nobreak

echo.
echo Starting ContentService...
cd "Backend\ContentService\ContentService"
start "ContentService" cmd /k "mvn spring-boot:run"
cd ..\..\..

echo.
echo Waiting 10 seconds for ContentService to start...
timeout /t 10 /nobreak

echo.
echo Starting Frontend...
cd Frontend
start "Frontend" cmd /k "npm run dev"
cd ..

echo.
echo All services started!
echo UserService: http://localhost:8081
echo ContentService: http://localhost:8082
echo Frontend: http://localhost:3000
pause