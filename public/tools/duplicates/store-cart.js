class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }

    loadCart() {
        const saved = localStorage.getItem('litterra_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('litterra_cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(livroData) {
        const existingItem = this.items.find(item => item.id === livroData.id);
        
        if (existingItem) {
            existingItem.quantity += livroData.quantity || 1;
        } else {
            this.items.push({
                id: livroData.id || Date.now(),
                titulo: livroData.titulo,
                autor: livroData.autor,
                preco: parseFloat(livroData.preco),
                capa: livroData.capa,
                quantity: livroData.quantity || 1,
                checked: true
            });
        }
        
        this.saveCart();
        alert('Livro adicionado ao carrinho!');
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    toggleItem(itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.checked = !item.checked;
            this.saveCart();
        }
    }

    getTotal() {
        return this.items
            .filter(item => item.checked)
            .reduce((sum, item) => sum + (item.preco * item.quantity), 0);
    }

    getCheckedCount() {
        return this.items.filter(item => item.checked).length;
    }

    updateCartCount() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
        }
    }

    setupEventListeners() {
        const cartIcon = document.getElementById('carrinho-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.renderModal());
        }
    }

    renderModal() {
        const modal = document.getElementById('carrinhoModal');
        if (!modal) return;

        const itemsContainer = document.getElementById('carrinhoItems');
        const subtotalDiv = document.getElementById('carrinhoSubtotal');

        if (this.items.length === 0) {
            itemsContainer.innerHTML = '<p style="padding: 30px; text-align: center; color: #999;">Seu carrinho está vazio</p>';
            subtotalDiv.innerHTML = '';
            modal.style.display = 'flex';
            return;
        }

        itemsContainer.innerHTML = this.items.map(item => `
            <div class="carrinho-item">
                <input type="checkbox" class="item-check" data-id="${item.id}" ${item.checked ? 'checked' : ''}>
                <img src="${item.capa}" alt="${item.titulo}" class="carrinho-imagem">
                <div class="carrinho-info">
                    <h4>${item.titulo}</h4>
                    <p>${item.autor}</p>
                </div>
                <div class="carrinho-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                <div class="carrinho-controles">
                    <button class="btn-delete" data-id="${item.id}">🗑️</button>
                    <div class="quantidade-control">
                        <button class="qty-minus" data-id="${item.id}">−</button>
                        <input type="number" class="qty-value" value="${item.quantity}" readonly>
                        <button class="qty-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = this.getTotal();
        const checkedCount = this.getCheckedCount();

        subtotalDiv.innerHTML = `
            <div class="subtotal-row">
                <label class="select-all-label">
                    <input type="checkbox" id="selectAll" ${this.items.length > 0 && this.items.every(i => i.checked) ? 'checked' : ''}>
                    Selecionar tudo
                </label>
                <span class="subtotal-text">Subtotal (${checkedCount} produto${checkedCount !== 1 ? 's' : ''}): <strong>R$ ${total.toFixed(2).replace('.', ',')}</strong></span>
            </div>
        `;

        modal.style.display = 'flex';

        this.attachModalListeners();
    }

    attachModalListeners() {
        document.querySelectorAll('.item-check').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleItem(parseInt(e.target.dataset.id));
                this.renderModal();
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removeItem(parseInt(e.target.dataset.id));
                this.renderModal();
            });
        });

        document.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                const item = this.items.find(i => i.id === itemId);
                if (item) {
                    this.updateQuantity(itemId, item.quantity - 1);
                    this.renderModal();
                }
            });
        });

        document.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                const item = this.items.find(i => i.id === itemId);
                if (item) {
                    this.updateQuantity(itemId, item.quantity + 1);
                    this.renderModal();
                }
            });
        });

        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.items.forEach(item => item.checked = e.target.checked);
                this.saveCart();
                this.renderModal();
            });
        }

        const closeBtn = document.getElementById('closeCarrinho');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('carrinhoModal').style.display = 'none';
            });
        }

        const finalizarBtn = document.querySelector('.btn-finalizar');
        if (finalizarBtn) {
            finalizarBtn.addEventListener('click', () => {
                const checkedCount = this.getCheckedCount();
                if (checkedCount === 0) {
                    alert('Selecione pelo menos um produto!');
                    return;
                }
                alert(`Pedido finalizado com ${checkedCount} produto(s)!`);
                this.items = [];
                this.saveCart();
                document.getElementById('carrinhoModal').style.display = 'none';
                this.renderModal();
            });
        }

        const modal = document.getElementById('carrinhoModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
}

let cart = null;

document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});

function openCart() {
    if (cart) cart.renderModal();
}

function closeCart() {
    const modal = document.getElementById('carrinhoModal');
    if (modal) modal.style.display = 'none';
}

function addLivroCart(titulo, autor, preco, capa) {
    if (cart) {
        cart.addItem({
            titulo,
            autor,
            preco,
            capa,
            quantity: 1
        });
        cart.renderModal();
    }
}
