# TypeScript Fixes Verification Script (PowerShell)
# Run with: .\verify-fixes.ps1

Write-Host "TypeScript Fixes Verification Script"
Write-Host "===================================="
Write-Host ""

# -------------------- Helper functions --------------------

function PrintStatus {
    param(
        [bool]  $Success,
        [string]$Message
    )

    if ($Success) {
        Write-Host ("[OK]  " + $Message) -ForegroundColor Green
    }
    else {
        Write-Host ("[ERR] " + $Message) -ForegroundColor Red
    }
}

function PrintInfo {
    param(
        [string]$Message
    )

    Write-Host ("[INFO] " + $Message) -ForegroundColor Yellow
}

function CheckFile {
    param(
        [string]$Path
    )

    if (Test-Path -LiteralPath $Path) {
        PrintStatus $true ("Found: " + $Path)
        return $true
    }
    else {
        PrintStatus $false ("Missing: " + $Path)
        return $false
    }
}

# -------------------- Step 1: File checks --------------------

Write-Host "Step 1: Checking if files exist..."
Write-Host "-----------------------------------"

$filesExist = $true

$filesExist = $filesExist -and (CheckFile 'src\app\(admin)\admin\questions\[id]\edit\page.tsx')
$filesExist = $filesExist -and (CheckFile 'src\app\(admin)\admin\questions\create\page.tsx')
$filesExist = $filesExist -and (CheckFile 'src\features\exam-sessions\components\AnswerReviewCard.tsx')
$filesExist = $filesExist -and (CheckFile 'src\features\exam-sessions\components\UserExamCard.tsx')
$filesExist = $filesExist -and (CheckFile 'src\features\exam-sessions\hooks\useResultDetail.ts')
$filesExist = $filesExist -and (CheckFile 'src\features\questions\components\QuestionForm.tsx')

Write-Host ""

if (-not $filesExist) {
    Write-Host "Error: Some files are missing." -ForegroundColor Red
    Write-Host "Please make sure all fixed files are in the correct locations."
    exit 1
}

# -------------------- Step 2: Type check --------------------

Write-Host ""
Write-Host "Step 2: Running TypeScript type check..."
Write-Host "----------------------------------------"

$typeCheckOutput = pnpm run type-check 2>&1

if ($LASTEXITCODE -eq 0) {
    PrintStatus $true "TypeScript compilation successful (0 errors)."
    Write-Host ""
}
else {
    PrintStatus $false "TypeScript compilation failed."
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
    PrintStatus $true "Build successful."
    Write-Host ""
}
else {
    PrintStatus $false "Build failed."
    Write-Host ""
    Write-Host "Error details (last 50 lines):"
    $buildOutput | Select-Object -Last 50
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
    PrintStatus $false "Found old field: answer.questionContent (should be answer.examQuestion.content)."
    $issuesFound = $true
}
else {
    PrintStatus $true "No old field names in AnswerReviewCard."
}

# Check for old duration field in UserExamCard
$content = Get-Content 'src\features\exam-sessions\components\UserExamCard.tsx' -Raw
if ($content -match 'exam\.duration') {
    PrintStatus $false "Found old field: exam.duration (should be exam.durationMinutes)."
    $issuesFound = $true
}
else {
    PrintStatus $true "No old duration field in UserExamCard."
}

# Check for getResultDetail in useResultDetail
$content = Get-Content 'src\features\exam-sessions\hooks\useResultDetail.ts' -Raw
if ($content -match 'getResultDetail') {
    PrintStatus $false "Found old method: getResultDetail (should be getExamSession)."
    $issuesFound = $true
}
else {
    PrintStatus $true "No old API method in useResultDetail."
}

Write-Host ""

if ($issuesFound) {
    Write-Host "Static checks found old fields/methods." -ForegroundColor Yellow
    Write-Host "Please fix the issues above, then rerun this script." -ForegroundColor Yellow
    exit 1
}

# -------------------- Final summary --------------------

Write-Host "===================================="
Write-Host "All automated checks passed."
Write-Host "===================================="
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Start dev server: pnpm run dev"
Write-Host "2. Test admin question create:  http://localhost:3000/admin/questions/create"
Write-Host "3. Test admin question edit:    http://localhost:3000/admin/questions/1/edit"
Write-Host "4. Test exam duration display on dashboard"
Write-Host "5. Complete an exam and verify answer review"
Write-Host ""
Write-Host "If all manual tests pass, you can commit your changes."
Write-Host 'Example: git commit -m "fix: resolve TypeScript errors in admin and exam session modules"'
Write-Host ""
