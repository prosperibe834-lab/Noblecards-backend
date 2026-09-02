$baseUrl = "http://localhost:3000"

Write-Host "GHS BANK TRANSFER DEPOSIT TEST" -ForegroundColor Cyan
Write-Host "Creating test user via __test/create-user endpoint...`n" -ForegroundColor Yellow

# Create test user
$testEmail = "ghs-$(Get-Random)@test.com"
$createUserBody = @{
    email = $testEmail
    password = "TestPassword123!"
    firstName = "GHS"
    lastName = "Tester"
} | ConvertTo-Json

try {
    $createRes = Invoke-WebRequest -Uri "$baseUrl/__test/create-user" -Method POST -Headers @{ 'Content-Type' = 'application/json' } -Body $createUserBody -ErrorAction Stop
    $createData = $createRes.Content | ConvertFrom-Json
    
    if ($createData.error) {
        Write-Host "Error: $($createData.error)" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Test user created!" -ForegroundColor Green
    Write-Host "  User ID: $($createData.userId)"
    Write-Host "  Email: $($createData.email)"
    Write-Host "  Wallet ID: $($createData.walletId)`n"
}
catch {
    Write-Host "Failed to create test user: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Login
Write-Host "Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = "TestPassword123!"
} | ConvertTo-Json

try {
    $loginRes = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Headers @{ 'Content-Type' = 'application/json' } -Body $loginBody -ErrorAction Stop
    $loginData = $loginRes.Content | ConvertFrom-Json
    
    if ($null -eq $loginData.accessToken) {
        Write-Host "No token returned" -ForegroundColor Red
        exit 1
    }
    
    $token = $loginData.accessToken
    Write-Host "Token obtained`n" -ForegroundColor Green
}
catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create GHS Deposit
Write-Host "========== CREATING GHS BANK TRANSFER DEPOSIT ==========" -ForegroundColor Cyan
Write-Host ""

$depositBody = @{
    amount = 500
    currency = "GHS"
    paymentMethod = "BANK_TRANSFER"
    country = "Ghana"
    countryCode = "GH"
    idempotencyKey = "ghs-$(Get-Random)"
} | ConvertTo-Json

Write-Host "Request:" -ForegroundColor Yellow
Write-Host $depositBody
Write-Host ""

try {
    $depositRes = Invoke-WebRequest -Uri "$baseUrl/deposits" -Method POST -Headers @{ 'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json' } -Body $depositBody -ErrorAction Stop
    $depositData = $depositRes.Content | ConvertFrom-Json
    
    Write-Host "HTTP Status: $($depositRes.StatusCode)" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "========== FULL RESPONSE ==========" -ForegroundColor Cyan
    Write-Host ($depositData | ConvertTo-Json -Depth 15) -ForegroundColor White
    
    # Check for bank details
    Write-Host "`n========== ANALYSIS ==========" -ForegroundColor Cyan
    
    if ($depositData.bankName -or $depositData.accountNumber -or $depositData.metadata.bankTransfer) {
        Write-Host "SUCCESS: Bank transfer details found!" -ForegroundColor Green
        if ($depositData.bankName) {
            Write-Host "  Bank: $($depositData.bankName)"
            Write-Host "  Account: $($depositData.accountNumber)"
            Write-Host "  Account Name: $($depositData.accountName)"
        }
        if ($depositData.metadata.bankTransfer) {
            Write-Host "  Bank Transfer (Metadata): "
            Write-Host ($depositData.metadata.bankTransfer | ConvertTo-Json -Depth 3)
        }
    }
    else {
        Write-Host "FAILURE: No bank transfer details found!" -ForegroundColor Red
        Write-Host "  Response keys: " + ($depositData.PSObject.Properties.Name -join ", ")
    }
}
catch {
    $response = $_.Exception.Response
    if ($response) {
        Write-Host "HTTP Status: $($response.StatusCode)" -ForegroundColor Red
        $stream = $response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "Error Response: $body" -ForegroundColor Yellow
    }
    else {
        Write-Host "Request failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
