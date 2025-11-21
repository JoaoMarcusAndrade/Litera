# Littera - Sebo Online

Um site para venda de livros usados.

## Estrutura do Projeto

- `index.html` - Página inicial com carrossel e destaques
- `busca.html` - Página de resultados de busca
- `livro.html` - Página de detalhes de um livro
- `carrinho.html` - Página do carrinho (modal inline)
- `sobre.html` - Página sobre nós
- `contato.html` - Página de contato

### CSS
- `css/style.css` - Estilos gerais (header, footer, navegação)
- `css/busca.css` - Estilos específicos para busca
- `css/livro.css` - Estilos para página de livro
- `css/sobre.css` - Estilos para sobre
- `css/cart.css` - Estilos para modal do carrinho

### JavaScript
- `js/script.js` - Scripts gerais (carrossel, modal auth)
- `js/auth.js` - Autenticação (login/cadastro)
- `js/busca.js` - Funcionalidades de busca
- `js/livro.js` - Scripts para página de livro
- `js/sobre.js` - Scripts para sobre
- `js/cart-novo.js` - Gerenciamento do carrinho

### Imagens
- `img/` - Todas as imagens organizadas em subpastas

### Ferramentas
- `tools/` - Scripts auxiliares
  - `fix_styles.js` - Corrige estilos CSS (requer Node.js)
  - `start_server.bat` - Inicia servidor local simples
  - `duplicates/` - Arquivos duplicados/antigos mantidos para referência

## Como executar

1. Abra `index.html` no navegador
2. Ou use `tools/start_server.bat` para servidor local na porta 8080

## Desenvolvimento

- Linguagens: HTML, CSS, JavaScript
- Sem frameworks externos
- Armazenamento local com localStorage

## Notas

- Arquivos duplicados foram movidos para `tools/duplicates/`
- Execute `node tools/fix_styles.js` se houver problemas de CSS