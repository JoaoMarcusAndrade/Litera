function getCart() {
  return JSON.parse(localStorage.getItem('carrinho') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('carrinho', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = count;
}

function addToCart(book, qty) {
  const cart = getCart();
  const existing = cart.find(item => 
    item.title === book.title && 
    item.authors?.join() === book.authors?.join()
  );
  
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...book, quantity: qty });
  }
  
  saveCart(cart);
  updateCartCount();
  
  const icon = document.getElementById('carrinho-icon');
  if (icon) {
    icon.style.transform = 'scale(1.2)';
    setTimeout(() => icon.style.transform = '', 300);
  }
}

function openCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.add('active');
    renderCart();
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function updateCartItemQuantity(index, newQty) {
  const cart = getCart();
  if (cart[index]) {
    cart[index].quantity = Math.max(1, newQty);
    saveCart(cart);
    renderCart();
  }
}

function toggleSelectAll() {
  const checkbox = document.getElementById('selectAllCart');
  const itemCheckboxes = document.querySelectorAll('.cart-item-checkbox');
  itemCheckboxes.forEach(cb => cb.checked = checkbox.checked);
  updateSubtotal();
}

function updateSubtotal() {
  const cart = getCart();
  const itemCheckboxes = document.querySelectorAll('.cart-item-checkbox');
  let total = 0;
  let count = 0;

  itemCheckboxes.forEach((checkbox, index) => {
    if (checkbox.checked && cart[index]) {
      const priceText = cart[index].preco || '0';
      const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
      const quantity = cart[index].quantity || 1;
      total += price * quantity;
      count += quantity;
    }
  });

  const subtotalLabel = document.querySelector('.subtotal-label-cart');
  const subtotalAmount = document.querySelector('.subtotal-amount-cart');

  if (subtotalLabel) {
    subtotalLabel.textContent = `Subtotal (${count} produto${count !== 1 ? 's' : ''}):`;
  }
  if (subtotalAmount) {
    subtotalAmount.textContent = 'R$' + total.toFixed(2).replace('.', ',');
  }
}

function renderCart() {
  const cart = getCart();
  const itemsDiv = document.getElementById('cart-items');
  
  if (!itemsDiv) return;

  itemsDiv.innerHTML = '';

  if (cart.length === 0) {
    itemsDiv.innerHTML = '<div style="padding: 40px; text-align: center; color: #999;">Seu carrinho está vazio</div>';
    return;
  }

  cart.forEach((item, index) => {
    const priceStr = item.preco || 'R$ 0,00';
    const price = parseFloat(priceStr.replace('R$ ', '').replace(',', '.'));
    
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item-new';
    itemEl.innerHTML = `
      <input type="checkbox" class="cart-item-checkbox" checked onchange="updateSubtotal()">
      
      <div class="cart-item-image">
        <img src="${item.imageLink || './img/livro/placeholder.jpg'}" alt="${item.title}" onerror="this.src='./img/livro/placeholder.jpg'">
      </div>
      
      <div class="cart-item-details" style="flex: 1;">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-author">por ${(item.authors && item.authors[0]) || 'Desconhecido'}</div>
        <div class="cart-item-state">Livro em bom estado</div>
      </div>

      <div class="cart-item-controls">
        <div class="cart-item-price">${priceStr}</div>
        <button class="delete-btn-cart" onclick="removeFromCart(${index})">🗑️</button>
        <div style="display: flex; gap: 5px; border: 2px solid #8b6f47; border-radius: 20px; background: white;">
          <button class="quantity-btn-cart" onclick="updateCartItemQuantity(${index}, ${item.quantity - 1})">−</button>
          <span style="width: 30px; text-align: center; font-weight: 600; display: flex; align-items: center; justify-content: center;">${item.quantity}</span>
          <button class="quantity-btn-cart" onclick="updateCartItemQuantity(${index}, ${item.quantity + 1})">+</button>
        </div>
      </div>
    `;
    
    itemsDiv.appendChild(itemEl);
  });

  updateSubtotal();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  const modal = document.getElementById('cart-modal');
  if (modal) {
    const overlay = modal.querySelector('.modal-overlay-cart');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeCart();
        }
      });
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
    }
  });

  const btnAdicionar = document.getElementById('btn-adicionar');
  if (btnAdicionar) {
    btnAdicionar.addEventListener('click', () => {
      const titulo = document.getElementById('livro-titulo')?.innerText || '';
      const preco = document.getElementById('livro-preco')?.innerText || '0,00';
      const autor = document.getElementById('livro-autor')?.innerText || 'Desconhecido';
      const capa = document.getElementById('livro-capa')?.src || '';
      const quantidade = parseInt(document.getElementById('quantidade')?.value || 1);

      if (!titulo) {
        alert('Por favor, carregue um livro primeiro');
        return;
      }

      const book = {
        title: titulo,
        preco: 'R$ ' + preco,
        authors: [autor],
        imageLink: capa,
        quantity: quantidade
      };

      addToCart(book, quantidade);
      
      alert('Livro adicionado ao carrinho!');
      document.getElementById('quantidade').value = 1;
    });
  }

  const btnMais = document.getElementById('btn-mais');
  const btnMenos = document.getElementById('btn-menos');
  const quantidade = document.getElementById('quantidade');

  if (btnMais) {
    btnMais.addEventListener('click', () => {
      quantidade.value = parseInt(quantidade.value) + 1;
    });
  }

  if (btnMenos) {
    btnMenos.addEventListener('click', () => {
      const val = parseInt(quantidade.value);
      if (val > 1) quantidade.value = val - 1;
    });
  }
});
