# ─── TEST CONCURRENT REST API ───
# Terminal 1: go run main.go
# Terminal 2: .\test.ps1

Write-Host "═══ POST 3 tasks (they'll process concurrently) ═══" -ForegroundColor Cyan
$body1 = @{ title = "Task Alpha" } | ConvertTo-Json
$body2 = @{ title = "Task Beta" } | ConvertTo-Json
$body3 = @{ title = "Task Gamma" } | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method POST -Body $body1 -ContentType "application/json"
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method POST -Body $body2 -ContentType "application/json"
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method POST -Body $body3 -ContentType "application/json"

Write-Host "`n═══ GET all (should show pending/processing) ═══" -ForegroundColor Cyan
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method GET | ConvertTo-Json

Write-Host "`n═══ Wait 3 sec for workers... ═══" -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "═══ GET all (should show completed) ═══" -ForegroundColor Green
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method GET | ConvertTo-Json
