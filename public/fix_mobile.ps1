$cssFile = 'css/style.css'
$content = Get-Content $cssFile -Raw -Encoding UTF8

$search768 = '@media (max-width: 768px) {'
$replace768 = '@media (max-width: 1024px) {
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

@media (max-width: 768px) {'

$content = $content.Replace($search768, $replace768)

$search768nav = '    .nav-icons {
        gap: 12px;
        margin-right: 0;
    }'

$replace768nav = '    .nav-icons {
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
    }
    
    .search-box {
        display: none;
    }'

$content = $content.Replace($search768nav, $replace768nav)

$content | Out-File $cssFile -Encoding UTF8
Write-Host "CSS mobile responsivo configurado!"
