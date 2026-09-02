$baseUrl = "http://localhost:3000"
$testEmail = "ghs-$(Get-Random)@test.com"
$testPassword = "TestPassword123!"

Write-Host "GHS BANK TRANSFER DEPOSIT TEST" -ForegroundColor Cyan
Write-Host "Email: $testEmail`n" -ForegroundColor Yellow

# Register
Write-Host "1. Registering user..." -ForegroundColor Yellow
$registerBody = @{
    email = $testEmail
    password = $testPassword
    firstName = "GHS"
    lastName = "Tester"
} | ConvertTo-Json

$registerRes = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Headers @{ 'Content-Type' = 'application/json' } -Body $registerBody -ErrorAction SilentlyContinue
Write-Host "Status: $($registerRes.StatusCode)`n" -ForegroundColor Green

# Login
Write-Host "2. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginRes = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Headers @{ 'Content-Type' = 'application/json' } -Body $loginBody -ErrorAction Stop
    $loginData = $loginRes.Content | ConvertFrom-Json
    
    if ($null -ne $loginData.accessToken) {
        Write-Host "Status: $($loginRes.StatusCode)" -ForegroundColor Green
        $token = $loginData.accessToken
        Write-Host "Token obtained`n" -ForegroundColor Green
    }
    else {
        Write-Host "No token - email verification likely required`n" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "Login failed - email verification required`n" -ForegroundColor Yellow
    exit 1
}

# Get Wallet
Write-Host "3. Getting wallet..." -ForegroundColor Yellow
$walletRes = Invoke-WebRequest -Uri "$baseUrl/wallet" -Method GET -Headers @{ 'Authorization' = "Bearer $token" }
$walletData = $walletRes.Content | ConvertFrom-Json
Write-Host "Wallet: $($walletData.wallet.id)`n" -ForegroundColor Green

# Create GHS Deposit
Write-Host "4. Creating GHS Bank Transfer Deposit..." -ForegroundColor Yellow
$depositBody = @{
    amount = 500
    currency = "GHS"
    paymentMethod = "BANK_TRANSFER"
    country = "Ghana"
    countryCode = "GH"
    idempotencyKey = "ghs-$(Get-Random)"
} | ConvertTo-Json

Write-Host "Request: $depositBody`n"

try {
    $depositRes = Invoke-WebRequest -Uri "$baseUrl/deposits" -Method POST -Headers @{ 'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json' } -Body $depositBody -ErrorAction Stop
    $depositData = $depositRes.Content | ConvertFrom-Json
    
    Write-Host "Status: $($depositRes.StatusCode)`n" -ForegroundColor Green
    Write-Host "RESPONSE:" -ForegroundColor Cyan
    Write-Host ($depositData | ConvertTo-Json -Depth 10) -ForegroundColor White
    
    # Check for bank details
    if ($depositData.bankName -or $depositData.accountNumber) {
        Write-Host "`nSUCCESS: Bank details found!" -ForegroundColor Green
        Write-Host "Bank: $($depositData.bankName)"
        Write-Host "Account: $($depositData.accountNumber)"
    }
    elseif ($depositData.metadata.bankTransfer) {
        Write-Host "`nSUCCESS: Bank details in metadata!" -ForegroundColor Green
        Write-Host ($depositData.metadata.bankTransfer | ConvertTo-Json -Depth 3)
    }
    else {
        Write-Host "`nFAILURE: No bank details found!" -ForegroundColor Red
    }
}
catch {
    $response = $_.Exception.Response
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Red
    $stream = $response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $body = $reader.ReadToEnd()
    Write-Host "Error Response: $body" -ForegroundColor Yellow
}
