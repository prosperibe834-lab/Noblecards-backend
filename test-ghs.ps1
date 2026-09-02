# GHS Deposit Test using PowerShell
# This script tests the complete flow through HTTP API

$baseUrl = "http://localhost:3000"
$testEmail = "ghs-test-$(Get-Random)-$(Get-Date -Format 'yyyyMMddHHmmss')@test.com"
$testPassword = "TestPassword123!"

Write-Host "`n========== GHS BANK TRANSFER DEPOSIT TEST ==========`n" -ForegroundColor Cyan

Write-Host "Test Credentials:" -ForegroundColor Yellow
Write-Host "  Email: $testEmail"
Write-Host "  Password: $testPassword`n"

# STEP 1: Register
Write-Host "STEP 1: Register User" -ForegroundColor Yellow
$registerBody = @{
    email = $testEmail
    password = $testPassword
    firstName = "GHS"
    lastName = "Tester"
} | ConvertTo-Json

try {
    $registerRes = Invoke-WebRequest -Uri "$baseUrl/auth/register" `
        -Method POST `
        -Headers @{ 'Content-Type' = 'application/json' } `
        -Body $registerBody
    
    $registerData = $registerRes.Content | ConvertFrom-Json
    Write-Host "Status: $($registerRes.StatusCode)" -ForegroundColor Green
    Write-Host "✓ User registered`n"
}
catch {
    Write-Host "Registration error: $($_.Exception.Message)" -ForegroundColor Red
}

# STEP 2: Try Login
Write-Host "STEP 2: Login" -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginRes = Invoke-WebRequest -Uri "$baseUrl/auth/login" `
        -Method POST `
        -Headers @{ 'Content-Type' = 'application/json' } `
        -Body $loginBody
    
    $loginData = $loginRes.Content | ConvertFrom-Json
    Write-Host "Status: $($loginRes.StatusCode)" -ForegroundColor Green
    
    if ($null -ne $loginData.accessToken) {
        Write-Host "✓ Token obtained`n"
        $token = $loginData.accessToken
    }
    else {
        Write-Host "✗ No access token" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# STEP 3: Get Wallet
Write-Host "STEP 3: Get Wallet" -ForegroundColor Yellow
try {
    $walletRes = Invoke-WebRequest -Uri "$baseUrl/wallet" `
        -Method GET `
        -Headers @{ 'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json' }
    
    $walletData = $walletRes.Content | ConvertFrom-Json
    Write-Host "Status: $($walletRes.StatusCode)" -ForegroundColor Green
    Write-Host "Wallet ID: $($walletData.wallet.id)`n"
}
catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# STEP 4: Get Currencies
Write-Host "STEP 4: Verify GHS Currency" -ForegroundColor Yellow
try {
    $currRes = Invoke-WebRequest -Uri "$baseUrl/currencies" `
        -Method GET `
        -Headers @{ 'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json' }
    
    $currData = $currRes.Content | ConvertFrom-Json
    $ghsCurr = $currData | Where-Object { $_.code -eq 'GHS' }
    Write-Host "Status: $($currRes.StatusCode)" -ForegroundColor Green
    Write-Host "GHS Found: $(if ($ghsCurr) { 'YES' } else { 'NO' })`n"
}
catch {
    Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# STEP 5: CREATE GHS BANK TRANSFER DEPOSIT
Write-Host "========== STEP 5: CREATE GHS BANK TRANSFER DEPOSIT ==========" -ForegroundColor Cyan
$depositBody = @{
    amount = 500
    currency = "GHS"
    paymentMethod = "BANK_TRANSFER"
    country = "Ghana"
    countryCode = "GH"
    idempotencyKey = "ghs-test-$(Get-Date -Format 'yyyyMMddHHmmss')"
} | ConvertTo-Json

Write-Host "Request:" -ForegroundColor Yellow
Write-Host $depositBody
Write-Host ""

try {
    $depositRes = Invoke-WebRequest -Uri "$baseUrl/deposits" `
        -Method POST `
        -Headers @{ 'Authorization' = "Bearer $token"; 'Content-Type' = 'application/json' } `
        -Body $depositBody
    
    $depositData = $depositRes.Content | ConvertFrom-Json
    Write-Host "HTTP Status: $($depositRes.StatusCode)" -ForegroundColor Green
    Write-Host ""

    Write-Host "========== FULL RESPONSE ==========" -ForegroundColor Cyan
    Write-Host ($depositData | ConvertTo-Json -Depth 10)

    Write-Host "`n========== ANALYSIS ==========" -ForegroundColor Cyan
    
    Write-Host "CORE FIELDS:" -ForegroundColor Yellow
    Write-Host "  ID: $($depositData.id)"
    Write-Host "  Status: $($depositData.status)"
    Write-Host "  Currency: $($depositData.currency)"
    Write-Host "  Amount: $($depositData.amount)"
    Write-Host "  Provider: $($depositData.provider)"

    Write-Host "`nBANK TRANSFER DETAILS:" -ForegroundColor Yellow
    
    $bankName = if ($null -ne $depositData.bankName) { $depositData.bankName } else { $depositData.metadata.bankTransfer.bankName }
    $accountNumber = if ($null -ne $depositData.accountNumber) { $depositData.accountNumber } else { $depositData.metadata.bankTransfer.accountNumber }
    $accountName = if ($null -ne $depositData.accountName) { $depositData.accountName } else { $depositData.metadata.bankTransfer.accountName }
    $expiresAt = if ($null -ne $depositData.expiresAt) { $depositData.expiresAt } else { $depositData.metadata.bankTransfer.expiresAt }

    if ($bankName -or $accountNumber) {
        Write-Host "✓ Bank Details Found:" -ForegroundColor Green
        Write-Host "  Bank Name: $bankName"
        Write-Host "  Account Number: $accountNumber"
        Write-Host "  Account Name: $accountName"
        Write-Host "  Expires At: $expiresAt"
    }
    else {
        Write-Host "✗ Bank Details NOT FOUND" -ForegroundColor Red
    }
}
catch {
    Write-Host "Deposit creation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n========== TEST COMPLETE ==========" -ForegroundColor Cyan
