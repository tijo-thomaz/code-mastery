# ─── TEST REST API (PowerShell) ───
# Run: .\test.ps1 (while server is running in another terminal)

Write-Host "═══ GET all tasks ═══" -ForegroundColor Cyan
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method GET | ConvertTo-Json

Write-Host "`n═══ GET task by ID ═══" -ForegroundColor Cyan
Invoke-RestMethod -Uri http://localhost:8080/api/tasks/1 -Method GET | ConvertTo-Json

Write-Host "`n═══ POST new task ═══" -ForegroundColor Cyan
$body = @{ title = "New task"; done = $false } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json

Write-Host "`n═══ GET all tasks (after POST) ═══" -ForegroundColor Cyan
Invoke-RestMethod -Uri http://localhost:8080/api/tasks -Method GET | ConvertTo-Json

Write-Host "`n✅ All requests done!" -ForegroundColor Green
