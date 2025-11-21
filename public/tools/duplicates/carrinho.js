let cartData = [];

function adicionarAoCarrinho() {
    const titulo = document.getElementById('livro-titulo')?.innerText;
    const autor = document.getElementById('livro-autor')?.innerText;
    const preco = document.getElementById('livro-preco')?.innerText;
    const capa = document.getElementById('livro-capa')?.src;
    const qtyInput = document.querySelector('.qty-input');
    const quantidade = qtyInput ? parseInt(qtyInput.value) : 1;
    
    if (!titulo || !preco) {
        alert('Erro ao adicionar ao carrinho');
        return;
    }
    
    const livroId = 'livro_' + Date.now() + Math.random();
    const item = {
        id: livroId,
        titulo,
        autor,
        preco: parseFloat(preco),
        capa,
        quantidade,
        selecionado: true
    };
    
    cartData.push(item);
    localStorage.setItem('cart', JSON.stringify(cartData));
    openCart();
    alert('Livro adicionado ao carrinho!');
}

function openCart() {
    const modal = document.getElementById('carrinhoModal');
    if (modal) modal.style.display = 'flex';
    renderCart();
}

function closeCart() {
    const modal = document.getElementById('carrinhoModal');
    if (modal) modal.style.display = 'none';
}

function addToCart(livroId, titulo, autor, preco, capa) {
    const existente = cartData.find(item => item.id === livroId);
    
    if (existente) {
        existente.quantidade++;
    } else {
        cartData.push({
            id: livroId,
            titulo,
            autor,
            preco: parseFloat(preco),
            capa,
            quantidade: 1,
            selecionado: true
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartData));
    openCart();
}

function removeFromCart(livroId) {
    cartData = cartData.filter(item => item.id !== livroId);
    localStorage.setItem('cart', JSON.stringify(cartData));
    renderCart();
}

function updateQuantity(livroId, quantidade) {
    const item = cartData.find(item => item.id === livroId);
    if (item) {
        item.quantidade = Math.max(1, quantidade);
        localStorage.setItem('cart', JSON.stringify(cartData));
        renderCart();
    }
}

function toggleItem(livroId) {
    const item = cartData.find(item => item.id === livroId);
    if (item) {
        item.selecionado = !item.selecionado;
        renderCart();
    }
}

function toggleSelectAll(checked) {
    cartData.forEach(item => item.selecionado = checked);
    renderCart();
}

function renderCart() {
    const container = document.getElementById('carrinhoItems');
    if (!container) return;
    
    if (cartData.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Carrinho vazio</p>';
        updateSubtotal();
        return;
    }
    
    container.innerHTML = cartData.map(item => `
        <div class="carrinho-item">
            <input type="checkbox" ${item.selecionado ? 'checked' : ''} 
                   onchange="toggleItem('${item.id}')" class="carrinho-checkbox">
            <img src="${item.capa}" alt="${item.titulo}" class="carrinho-imagem">
            <div class="carrinho-info">
                <h4>${item.titulo}</h4>
                <p>por ${item.autor}</p>
            </div>
            <div class="carrinho-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
            <div class="carrinho-controles">
                <button onclick="removeFromCart('${item.id}')" class="btn-delete">🗑️</button>
                <div class="quantidade-control">
                    <button onclick="updateQuantity('${item.id}', ${item.quantidade - 1})">−</button>
                    <input type="number" value="${item.quantidade}" readonly>
                    <button onclick="updateQuantity('${item.id}', ${item.quantidade + 1})">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateSubtotal();
}

function updateSubtotal() {
    const total = cartData
        .filter(item => item.selecionado)
        .reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    
    const selecionados = cartData.filter(item => item.selecionado).length;
    const totalItens = cartData.length;
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = selecionados === totalItens && totalItens > 0;
    }
    
    const subtotalDiv = document.getElementById('carrinhoSubtotal');
    if (subtotalDiv) {
        subtotalDiv.innerHTML = `
            <label>
                <input type="checkbox" id="selectAllCheckbox" ${selecionados === totalItens && totalItens > 0 ? 'checked' : ''} 
                       onchange="toggleSelectAll(this.checked)">
                Selecionar tudo
            </label>
            <span>Subtotal (${selecionados} produto${selecionados !== 1 ? 's' : ''}): R$ ${total.toFixed(2).replace('.', ',')}</span>
        `;
    }
}

function finalizarPedido() {
    const selecionados = cartData.filter(item => item.selecionado);
    if (selecionados.length === 0) {
        alert('Selecione pelo menos um produto!');
        return;
    }
    alert('Pedido finalizado com ' + selecionados.length + ' produto(s)!');
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cartData = JSON.parse(saved);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    const modal = document.getElementById('carrinhoModal');
    const closeBtn = document.getElementById('closeCarrinho');
    
    if (closeBtn) {
        closeBtn.onclick = closeCart;
    }
    
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) closeCart();
        };
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeCart();
        }
    });
});
