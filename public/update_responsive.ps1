$stylePath = "css/style.css"
$content = Get-Content $stylePath -Raw -Encoding UTF8

$pattern1024 = @"
}

@media (max-width: 768px) {
"@

$replacement1024 = @"
}

@media (max-width: 1024px) {
    .search-box {
        display: none;
    }
    
    .nav-icons {
        gap: 15px;
    }
    
    .carrinho {
        width: 32px;
        height: 36px;
    }
    
    .lupa-icon img {
        width: 32px;
        height: 32px;
    }
    
    .menu-icon {
        font-size: 28px;
    }
    
    .user-wrapper {
        padding: 0;
    }
    
    .user-wrapper img {
        width: 32px;
        height: 32px;
    }
}

@media (max-width: 768px) {
"@

$content = $content -replace [regex]::Escape($pattern1024), $replacement1024

$pattern768 = '.nav-icons {
        gap: 12px;
        margin-right: 0;
    }'

$replacement768 = '.nav-icons {
        gap: 15px;
        margin-right: 0;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        background: #ffffff;
        border-top: 2px solid #5e0b0b;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        z-index: 999;
    }
    
    .carrinho {
        width: 32px;
        height: 36px;
        margin: 0;
    }
    
    .lupa-icon img {
        width: 32px;
        height: 32px;
        margin: 0;
    }
    
    .menu-icon {
        font-size: 28px;
    }
    
    .user-wrapper {
        padding: 0;
    }
    
    .user-wrapper img {
        width: 32px;
        height: 32px;
    }'

$content = $content -replace [regex]::Escape($pattern768), $replacement768

$content | Out-File $stylePath -Encoding UTF8
Write-Host "CSS atualizado com sucesso!"
