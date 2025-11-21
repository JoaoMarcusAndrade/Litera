const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'livro.css');

let content = fs.readFileSync(cssPath, 'utf8');

content = content.replace(
  /\.livro-direita h1 \{[\s\S]*?border-bottom: 3px solid #630000;[\s\S]*?\}/,
  `.livro-direita h1 {
    color: #2c3e50;
    font-size: 36px;
    font-weight: 900;
    margin-bottom: 20px;
    padding-bottom: 0;
    border-bottom: none;
}`
);

content = content.replace(
  /\.preco-destaque \{[\s\S]*?margin-top: 20px;[\s\S]*?\}/,
  `.preco-destaque {
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
}`
);

fs.writeFileSync(cssPath, content, 'utf8');
console.log('✅ CSS atualizado com sucesso!');
