# Script to run frontend in Docker

Write-Host "Starting Honda Plus Frontend in Docker..." -ForegroundColor Cyan

# Build and start containers
docker-compose -f docker-compose.frontend.yml up -d

Write-Host "
Frontend is running at http://localhost:3000" -ForegroundColor Green
Write-Host "MongoDB Express is available at http://localhost:8081" -ForegroundColor Green
Write-Host "Redis Commander is available at http://localhost:8082" -ForegroundColor Green

Write-Host "
To stop the containers, run: docker-compose -f docker-compose.frontend.yml down" -ForegroundColor Yellow