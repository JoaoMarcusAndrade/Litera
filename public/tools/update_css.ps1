$cssPath = Get-Item 'c:\Users\Rafael\Desktop\LITTERA NOVO\css\livro.css' | Select-Object -ExpandProperty FullName
$content = [System.IO.File]::ReadAllText($cssPath, [System.Text.Encoding]::UTF8)

# Nova estilo para preco-destaque
$newPrecoStyle = '.preco-destaque {
    font-size: 28px;
    font-weight: 900;
    color: #028700;
    margin: 20px 0;
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    padding: 12px 16px;
    border-radius: 8px;
    border-left: 5px solid #028700;
    box-shadow: 0 4px 12px rgba(2, 135, 0, 0.2);
    display: inline-block;
    min-width: 200px;
}'

# Substituir preco-destaque (usando regex mais flexível)
$pattern = '\.preco-destaque\s*\{[^}]*?\}'
$content = $content -replace $pattern, $newPrecoStyle

# Salvar
[System.IO.File]::WriteAllText($cssPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "CSS atualizado com sucesso!"
