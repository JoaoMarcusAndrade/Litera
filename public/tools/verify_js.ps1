param([string]$htmlPath = "c:\Users\Rafael\Desktop\LITTERA NOVO\livro.html")

Write-Host "=== Verificando Implementação dos Botões de Quantidade ===" -ForegroundColor Cyan

# 1. Verificar se HTML tem os elementos
Write-Host "`n1. Verificando Estrutura HTML..." -ForegroundColor Yellow
$htmlContent = Get-Content $htmlPath -Raw

$hasMinus = $htmlContent -match '<button class="qty-btn">−</button>'
$hasPlus = $htmlContent -match '<button class="qty-btn">\+</button>'
$hasInput = $htmlContent -match '<input type="number" class="qty-input"'
$hasStockSpan = $htmlContent -match 'id="livro-estoque"'

Write-Host "   ✓ Botão Menos: $(if($hasMinus) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasMinus) {'Green'} else {'Red'})
Write-Host "   ✓ Botão Mais: $(if($hasPlus) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasPlus) {'Green'} else {'Red'})
Write-Host "   ✓ Input Quantidade: $(if($hasInput) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasInput) {'Green'} else {'Red'})
Write-Host "   ✓ Span Estoque: $(if($hasStockSpan) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasStockSpan) {'Green'} else {'Red'})

# 2. Verificar se script.js está incluso
Write-Host "`n2. Verificando Scripts..." -ForegroundColor Yellow
$hasScriptJs = $htmlContent -match '<script src="js/script.js"'
$hasAuthJs = $htmlContent -match '<script src="./js/auth.js"'

Write-Host "   ✓ script.js incluído: $(if($hasScriptJs) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasScriptJs) {'Green'} else {'Red'})
Write-Host "   ✓ auth.js incluído: $(if($hasAuthJs) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasAuthJs) {'Green'} else {'Red'})

# 3. Verificar se código de quantidade está em script.js
Write-Host "`n3. Verificando Código em script.js..." -ForegroundColor Yellow
$scriptPath = "c:\Users\Rafael\Desktop\LITTERA NOVO\js\script.js"
$scriptContent = Get-Content $scriptPath -Raw

$hasQtySelection = $scriptContent -match 'querySelector\("\.qty-input"\)'
$hasButtonSelection = $scriptContent -match 'querySelectorAll\("\.qty-btn"\)'
$hasMinsusListener = $scriptContent -match 'minusBtn\.addEventListener.*click'
$hasPlusListener = $scriptContent -match 'plusBtn\.addEventListener.*click'
$hasValidation = $scriptContent -match 'maxStock'

Write-Host "   ✓ Seleção Input: $(if($hasQtySelection) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasQtySelection) {'Green'} else {'Red'})
Write-Host "   ✓ Seleção Botões: $(if($hasButtonSelection) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasButtonSelection) {'Green'} else {'Red'})
Write-Host "   ✓ Listener Menos: $(if($hasMinsusListener) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasMinsusListener) {'Green'} else {'Red'})
Write-Host "   ✓ Listener Mais: $(if($hasPlusListener) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasPlusListener) {'Green'} else {'Red'})
Write-Host "   ✓ Validação Estoque: $(if($hasValidation) {'OK'} else {'FALTA'})" -ForegroundColor $(if($hasValidation) {'Green'} else {'Red'})

# 4. Resumo Final
Write-Host "`n4. Resumo Final:" -ForegroundColor Cyan
$allPass = $hasMinus -and $hasPlus -and $hasInput -and $hasStockSpan -and $hasScriptJs -and $hasQtySelection -and $hasButtonSelection -and $hasMinsusListener -and $hasPlusListener -and $hasValidation

if($allPass) {
    Write-Host "   ✅ IMPLEMENTAÇÃO COMPLETA!" -ForegroundColor Green
    Write-Host "`n   Os botões + e - devem funcionar agora!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Algum elemento está faltando!" -ForegroundColor Red
}

Write-Host "`n=== FIM DA VERIFICAÇÃO ===" -ForegroundColor Cyan
