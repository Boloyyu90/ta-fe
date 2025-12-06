# TypeScript Fixes Verification Script (PowerShell)
# Run this in PowerShell: .\verify-fixes.ps1

Write-Host "🚀 TypeScript Fixes Verification Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# -------------------- Helpers --------------------

function Print-Status {
    param(
        [bool]  $Success,
        [string]$Message
    )

    if ($Success) {
        Write-Host "✓ $Message" -ForegroundColor Green
    } else {
        Write-Host "✗ $Message" -ForegroundColor Red
    }
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

function Check-File {
    param([string]$Path)

    if (Test-Path -LiteralPath $Path) {
        Print-Status $true "Found: $Path"
        return $true
    } else {
        Print-Status $false "Missing: $Path"
        return $false
    }
}

# -------------------- Step 1: File checks --------------------

Write-Host "Step 1: Checking if files exist..."
Write-Host "-----------------------------------"

$filesExist = $true

$filesExist = $filesExist -and (Check-File 'src\app\(admin)\admin\questions\[id]\edit\page.tsx')
$filesExist = $filesExist -and (Check-File 'src\app\(admin)\admin\questions\create\page.tsx')
$filesExist = $filesExist -and (Check-File 'src\features\exam-sessions\components\AnswerReviewCard.tsx')
$filesExist = $filesExist -and (Check-File 'src\features\exam-sessions\components\UserExamCard.tsx')
$filesExist = $filesExist -and (Check-File 'src\features\exam-sessions\hooks\useResultDetail.ts')
$filesExist = $filesExist -and (Check-File 'src\features\questions\components\QuestionForm.tsx')

Write-Host ""

if (-not $filesExist) {
    Write-Host "Error: Some files are missing!" -ForegroundColor Red
    Write-Host "Please ensure you've copied all fixed files to the correct locations."
    exit 1
}

# -------------------- Step 2: Type check --------------------

Write-Host ""
Write-Host "Step 2: Running TypeScript type check..."
Write-Host "----------------------------------------"

$typeCheckOutput = pnpm run type-check 2>&1
if ($LASTEXITCODE -eq 0) {
    Print-Status $true "TypeScript compilation successful (0 errors)"
    Write-Host ""
} else {
    Print-Status $false "TypeScript compilation failed"
    Write-Host ""
    Write-Host "Error details:"
    Write-Host $typeCheckOutput
    Write-Host ""
    Write-Host "Fix the errors above before proceeding." -ForegroundColor Red
    exit 1
}

# -------------------- Step 3: Build --------------------

Write-Host ""
Write-Host "Step 3: Running build..."
Write-Host "------------------------"

$buildOutput = pnpm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Print-Status $true "Build successful"
    Write-Host ""
} else {
    Print-Status $false "Build failed"
    Write-Host ""
    Write-Host "Error details:"
    Write-Host ($buildOutput | Select-Object -Last 50)
    Write-Host ""
    Write-Host "Fix the build errors above before proceeding." -ForegroundColor Red
    exit 1
}

# -------------------- Step 4: Static content checks --------------------

Write-Host ""
Write-Host "Step 4: Checking for common issues..."
Write-Host "--------------------------------------"

$issuesFound = $false

# Check for old field names in AnswerReviewCard
$content = Get-Content 'src\features\exam-sessions\components\AnswerReviewCard.tsx' -Raw
if ($content -match 'answer\.questionContent') {
    Print-Status $false "Found old field: answer.questionContent (should be answer.examQuestion.content)"
    $issuesFound = $true
} else {
    Print-Status $true "No old field names in AnswerReviewCard"
}

# Check for old duration field in UserExamCard
$content = Get-Content 'src\features\exam-sessions\components\UserExamCard.tsx' -Raw
if ($content -match 'exam\.duration') {
    Print-Status $false "Found old field: exam.duration (should be exam.durationMinutes)"
    $issuesFound = $true
} else {
    Print-Status $true "No old duration field in UserExamCard"
}

# Check for getResultDetail in useResultDetail
$content = Get-Content 'src\features\exam-sessions\hooks\useResultDetail.ts' -Raw
if ($content -match 'getResultDetail') {
    Print-Status $false "Found old method: getResultDetail (should be getExamSession)"
    $issuesFound = $true
} else {
    Print-Status $true "No old API method in useResultDetail"
}

Write-Host ""

if ($issuesFound) {
    Write-Host "⚠ Static checks found leftover old fields/methods." -ForegroundColor Yellow
    Write-Host "Please fix the issues above, then rerun this script." -ForegroundColor Yellow
    exit 1
}

# -------------------- Final summary --------------------

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All automated checks passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Start dev server: pnpm run dev"
Write-Host "2. Test admin question create: http://localhost:3000/admin/questions/create"
Write-Host "3. Test admin question edit: http://localhost:3000/admin/questions/1/edit"
Write-Host "4. Test exam duration display on dashboard"
Write-Host "5. Complete an exam and verify answer review"
Write-Host ""
Write-Host "If all manual tests pass, you're ready to commit!"
Write-Host ""
Write-Host 'Suggested commit command:'
Write-Host 'git commit -m "fix: resolve TypeScript errors in admin and exam session modules"'
Write-Host ""
