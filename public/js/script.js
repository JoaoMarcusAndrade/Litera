// =======================================================
// script.js - Versão organizada, sem duplicações e com carrosséis funcionando
// =======================================================

// =======================================================
// CARRINHO - Funções globais
// =======================================================
function openCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.add('show');
    renderCart();
  }
}

function closeCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}
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
  const existing = cart.find(item => item.title === book.title && item.authors?.join() === book.authors?.join());
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...book, quantity: qty });
  }
  saveCart(cart);
  updateCartCount();
  // animation
  const icon = document.getElementById('carrinho-icon');
  if (icon) {
    icon.style.transform = 'scale(1.2)';
    setTimeout(() => icon.style.transform = '', 300);
  }
  // toast
  const toast = document.getElementById('toast');
  if (toast) {
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 2000);
  }
}



document.addEventListener("DOMContentLoaded", () => {
  console.log("[script] DOM carregado");

  // ---------- utilidades ----------
  const qs = (id) => document.getElementById(id);
  const safeText = (id, text) => { const el = qs(id); if (el) el.innerText = text; };

  // =======================================================
  // QUANTIDADE BUTTONS (+ e -)
  // =======================================================
  const qtyInput = document.querySelector(".qty-input");
  const qtyBtns = document.querySelectorAll(".qty-btn");

  if (qtyInput && qtyBtns.length === 2) {
    const minusBtn = qtyBtns[0];
    const plusBtn = qtyBtns[1];

    minusBtn.addEventListener("click", () => {
      let currentValue = parseInt(qtyInput.value) || 1;
      if (currentValue > 1) {
        qtyInput.value = currentValue - 1;
      }
    });

    plusBtn.addEventListener("click", () => {
      let currentValue = parseInt(qtyInput.value) || 1;
      const maxStock = parseInt(document.querySelector("#livro-estoque")?.innerText) || 99;
      if (currentValue < maxStock) {
        qtyInput.value = currentValue + 1;
      }
    });

    qtyInput.addEventListener("change", () => {
      let value = parseInt(qtyInput.value) || 1;
      const maxStock = parseInt(document.querySelector("#livro-estoque")?.innerText) || 99;
      if (value < 1) qtyInput.value = 1;
      if (value > maxStock) qtyInput.value = maxStock;
    });
  }

  // =======================================================
  // CLIQUE EM LIVROS
  // =======================================================
  function aplicarCliqueLivro(card, livroInfo) {
    if (!card) return;
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      localStorage.setItem("livroSelecionado", JSON.stringify(livroInfo));
      window.location.href = "livro.html";
    });
  }

  // =======================================================
  // MENU LATERAL
  // =======================================================
  const menuBtn = qs("menu-btn");
  const sidebar = qs("sidebar");
  const closeBtn = qs("close-btn");
  const overlay = qs("overlay"); // AGORA EXISTE

  if (menuBtn && sidebar && closeBtn && overlay) {
    menuBtn.addEventListener("click", () => {
      sidebar.style.width = "320px";
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    function fecharMenu() {
      sidebar.style.width = "0";
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", fecharMenu);
    overlay.addEventListener("click", fecharMenu);
  }

  // =======================================================
  // livro.html — CARREGAR LIVRO
  // =======================================================
  if (window.location.pathname.includes("livro.html")) {
    const livroData = localStorage.getItem("livroSelecionado");

    if (!livroData) {
      safeText("livro-titulo", "Livro não encontrado");
      return;
    }

    const livro = JSON.parse(livroData);

    safeText("livro-titulo", livro.title || livro.titulo || "Livro sem título");
    safeText("livro-autor", livro.authors?.join(", ") || livro.autor || "Autor desconhecido");
    safeText("livro-paginas", livro.pageCount || livro.paginas || "--");
    safeText("livro-editora", livro.publisher || livro.publicador || livro.editora || "Desconhecida");
    safeText("livro-isbn", livro.isbn || "Não informado");
    safeText("livro-preco", livro.preco || "R$ 39,90");
    safeText("livro-descricao", livro.description || livro.descricao || "Sem descrição disponível.");

    const capaEl = qs("livro-capa");
    if (capaEl)
      capaEl.src = livro.capa || livro.imageLinks?.thumbnail || livro.imagem || "https://via.placeholder.com/260x380.png?text=Sem+Capa";

    carregarSemelhantes(livro.authors?.[0] || livro.title);
  }

  // =======================================================
  // RECOMENDADOS (CARROSSEL)
  // =======================================================
  async function carregarSemelhantes(autorOuTitulo) {
    const container = qs("livros-similares");
    if (!container) return;

    try {
      const q = encodeURIComponent(`inauthor:${autorOuTitulo}`);
      const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=8`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      if (!dados.items || dados.items.length === 0) {
        container.innerHTML = "<p>Nenhum livro semelhante encontrado.</p>";
        return;
      }

      container.innerHTML = `
        <div class="produtos-carousel recomendados-carousel">
          <button class="prod-seta esquerda">&#8249;</button>
          <div class="produtos-track recomendados-track"></div>
          <button class="prod-seta direita">&#8250;</button>
        </div>
      `;

      const track = container.querySelector(".recomendados-track");

      if (!dados.items || dados.items.length === 0) {
        track.innerHTML = "<p>Nenhum livro encontrado nesta categoria.</p>";
        return;
      }

      dados.items.forEach(item => {
        const info = item.volumeInfo;

        if (!info.imageLinks?.thumbnail) return; // Pular livros sem capa

        const livroInfo = {
          title: info.title,
          authors: info.authors || [],
          publisher: info.publisher,
          pageCount: info.pageCount,
          description: info.description,
          capa: info.imageLinks.thumbnail,
          preco: `R$ ${(Math.random() * 40 + 10).toFixed(2)}`,
          isbn: info.industryIdentifiers?.[0]?.identifier || "N/A"
        };

        const card = document.createElement("div");
        card.className = "prod-card";
        card.innerHTML = `
          <img src="${livroInfo.capa}">
          <p class="titulo">${livroInfo.title}</p>
          <p class="preco">${livroInfo.preco}</p>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);
      });

      attachCarouselControls(container.querySelector(".recomendados-carousel"));
    } catch (erro) {
      console.error("[carregarSemelhantes] Erro:", erro);
    }
  }

  // =======================================================
  // PRODUTOS (CARROSSEL PRINCIPAL)
  // =======================================================
  async function carregarProdutos() {
    const track = document.querySelector(".produtos-track");
    const indicadores = document.querySelector(".produtos-indicadores");

    if (!track) return;

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:Harry+Potter+OR+inauthor:J.K.+Rowling+OR+intitle:O+Senhor+dos+Anéis&langRestrict=pt&maxResults=20`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      track.innerHTML = "";
      indicadores.innerHTML = "";

      dados.items.forEach((item, i) => {
        const info = item.volumeInfo;

        const livroInfo = {
          title: info.title,
          authors: info.authors,
          publisher: info.publisher,
          pageCount: info.pageCount,
          description: info.description,
          capa: info.imageLinks?.thumbnail,
          preco: `R$ ${(Math.random() * 40 + 10).toFixed(2)}`,
          isbn: info.industryIdentifiers?.[0]?.identifier || "N/A"
        };

        const card = document.createElement("div");
        card.className = "prod-card";
        card.innerHTML = `
          <img src="${livroInfo.capa}">
          <p class="titulo">${livroInfo.title}</p>
          <p class="preco">${livroInfo.preco}</p>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);

        const dot = document.createElement("span");
        dot.className = "prod-dot";
        if (i === 0) dot.classList.add("active");
        indicadores.appendChild(dot);
      });

      attachCarouselControls(document.querySelector(".produtos-carousel"));
    } catch (e) {
      console.error("[produtos] Erro ao carregar produtos:", e);
    }
  }

  carregarProdutos();

  // =======================================================
  // MAIS VENDIDOS
  // =======================================================
  async function carregarMaisVendidos() {
    const track = document.querySelector(".mv-track");
    if (!track) return;

    try {
      const resp = await fetch("https://www.googleapis.com/books/v1/volumes?q=popular&maxResults=12");
      const data = await resp.json();

      track.innerHTML = "";

      data.items.forEach(livro => {
        const info = livro.volumeInfo;

        const livroInfo = {
          title: info.title,
          authors: info.authors,
          publisher: info.publisher,
          pageCount: info.pageCount,
          description: info.description,
          capa: info.imageLinks?.thumbnail,
          preco: `R$ ${(Math.random() * 40 + 10).toFixed(2)}`,
          isbn: info.industryIdentifiers?.[0]?.identifier || "N/A"
        };

        const card = document.createElement("div");
        card.className = "prod-card";
        card.innerHTML = `
          <img src="${livroInfo.capa}">
          <p class="titulo">${livroInfo.title}</p>
          <p class="preco">${livroInfo.preco}</p>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);
      });

      attachCarouselControls(document.querySelector(".mv-carousel"));
    } catch (erro) {
      console.log("ERRO carregando Mais Vendidos:", erro);
    }
  }

  carregarMaisVendidos();

  // =======================================================
  // ROMANCES POPULARES
  // =======================================================
  async function carregarRomance() {
    const track = document.querySelector(".romance-track");
    if (!track) return;

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:Orgulho+e+Preconceito+OR+inauthor:Jane+Austen+OR+intitle:Romeu+e+Julieta&langRestrict=pt&maxResults=20`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      track.innerHTML = "";

      if (!dados.items || dados.items.length === 0) {
        track.innerHTML = "<p>Nenhum livro encontrado nesta categoria.</p>";
        return;
      }

      dados.items.forEach(item => {
        const info = item.volumeInfo;

        if (!info.imageLinks?.thumbnail) return; // Pular livros sem capa

        const livroInfo = {
          title: info.title,
          authors: info.authors || [],
          publisher: info.publisher,
          pageCount: info.pageCount,
          description: info.description,
          capa: info.imageLinks.thumbnail,
          preco: `R$ ${(Math.random() * 40 + 10).toFixed(2)}`,
          isbn: info.industryIdentifiers?.[0]?.identifier || "N/A"
        };

        const card = document.createElement("div");
        card.className = "prod-card";
        card.innerHTML = `
          <img src="${livroInfo.capa}">
          <p class="titulo">${livroInfo.title}</p>
          <p class="preco">${livroInfo.preco}</p>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);
      });

      attachCarouselControls(document.querySelector(".romance-carousel"));
    } catch (e) {
      console.error("[romance] Erro ao carregar romances:", e);
    }
  }

  carregarRomance();

  // =======================================================
  // FICÇÃO CIENTÍFICA
  // =======================================================
  async function carregarFiccao() {
    const track = document.querySelector(".ficcao-track");
    if (!track) return;

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:Duna+OR+inauthor:Frank+Herbert+OR+intitle:Neuromancer&langRestrict=pt&maxResults=20`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      track.innerHTML = "";

      if (!dados.items || dados.items.length === 0) {
        track.innerHTML = "<p>Nenhum livro encontrado nesta categoria.</p>";
        return;
      }

      dados.items.forEach(item => {
        const info = item.volumeInfo;

        if (!info.imageLinks?.thumbnail) return; // Pular livros sem capa

        const livroInfo = {
          title: info.title,
          authors: info.authors || [],
          publisher: info.publisher,
          pageCount: info.pageCount,
          description: info.description,
          capa: info.imageLinks.thumbnail,
          preco: `R$ ${(Math.random() * 40 + 10).toFixed(2)}`,
          isbn: info.industryIdentifiers?.[0]?.identifier || "N/A"
        };

        const card = document.createElement("div");
        card.className = "prod-card";
        card.innerHTML = `
          <img src="${livroInfo.capa}">
          <p class="titulo">${livroInfo.title}</p>
          <p class="preco">${livroInfo.preco}</p>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);
      });

      attachCarouselControls(document.querySelector(".ficcao-carousel"));
    } catch (e) {
      console.error("[ficcao] Erro ao carregar ficção científica:", e);
    }
  }

  carregarFiccao();

  // =======================================================
  // AVENTURA E MISTÉRIO
  // =======================================================
  async function carregarAventura() {
    const track = document.querySelector(".aventura-track");
    if (!track) return;

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:Sherlock+Holmes+OR+inauthor:Arthur+Conan+Doyle+OR+intitle:O+Cão+dos+Baskerville&langRestrict=pt&maxResults=20`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      track.innerHTML = "";

      if (!dados.items || dados.items.length === 0) {
        track.innerHTML = "<p>Nenhum livro encontrado nesta categoria.</p>";
        return;
      }

      dados.items.forEach(item => {
        const info = item.volumeInfo;

        if (!info.imageLinks?.thumbnail) return; // Pular livros sem capa

        const livroInfo = {
          title: info.title,
          authors: info.authors || [],
          publisher: info.publisher,
          pageCount: info.pageCount,
          description: info.description,
          capa: info.imageLinks.thumbnail,
          preco: `R$ ${(Math.random() * 40 + 10).toFixed(2)}`,
          isbn: info.industryIdentifiers?.[0]?.identifier || "N/A"
        };

        const card = document.createElement("div");
        card.className = "prod-card";
        card.innerHTML = `
          <img src="${livroInfo.capa}">
          <p class="titulo">${livroInfo.title}</p>
          <p class="preco">${livroInfo.preco}</p>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);
      });

      attachCarouselControls(document.querySelector(".aventura-carousel"));
    } catch (e) {
      console.error("[aventura] Erro ao carregar aventura e mistério:", e);
    }
  }

  carregarAventura();

  // =======================================================
  // FILOSOFIA
  // =======================================================
  async function carregarFilosofia() {
    const track = document.querySelector(".filosofia-track");
    if (!track) return;

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:Assim+Falou+Zaratustra+OR+inauthor:Friedrich+Nietzsche+OR+intitle:Crítica+da+Razão+Pura&langRestrict=pt&maxResults=20`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      track.innerHTML = "";

      if (!dados.items || dados.items.length === 0) {
        track.innerHTML = "<p>Nenhum livro encontrado nesta categoria.</p>";
        return;
      }

      dados.items.forEach(item => {
        const info = item.volumeInfo;

        if (!info.imageLinks?.thumbnail) return; // Pular livros sem capa

        const livroInfo = {
          title: info.title,
          authors: info.authors || [],
          publisher: info.publisher,
          pageCount: info.pageCount,
          description: info.description,
          capa: info.imageLinks.thumbnail,
          preco: `R$ ${(Math.random() * 40 + 10).toFixed(2)}`,
          isbn: info.industryIdentifiers?.[0]?.identifier || "N/A"
        };

        const card = document.createElement("div");
        card.className = "prod-card";
        card.innerHTML = `
          <img src="${livroInfo.capa}">
          <p class="titulo">${livroInfo.title}</p>
          <p class="preco">${livroInfo.preco}</p>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);
      });

      attachCarouselControls(document.querySelector(".filosofia-carousel"));
    } catch (e) {
      console.error("[filosofia] Erro ao carregar filosofia:", e);
    }
  }

  carregarFilosofia();

  // =======================================================
  // HISTÓRIAS EM QUADRINHOS
  // =======================================================
  async function carregarHQs() {
    const track = document.querySelector(".hqs-track");
    if (!track) return;

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:Watchmen+OR+inauthor:Alan+Moore+OR+intitle:Turma+da+Mônica&langRestrict=pt&maxResults=20`;
      const resposta = await fetch(url);
      const dados = await resposta.json();

      track.innerHTML = "";

      if (!dados.items || dados.items.length === 0) {
        track.innerHTML = "<p>Nenhum livro encontrado nesta categoria.</p>";
        return;
      }

      dados.items.forEach(item => {
        const info = item.volumeInfo;

        if (!info.imageLinks?.thumbnail) return; // Pular livros sem capa

        const livroInfo = {
          title: info.title,
          authors: info.authors || [],
          publisher: info.publisher,
          pageCount: info.pageCount,
          description: info.description,
          capa: info.imageLinks.thumbnail,
          preco: `R$ ${(Math.random() * 40 + 10).toFixed(2)}`,
          isbn: info.industryIdentifiers?.[0]?.identifier || "N/A"
        };

        const card = document.createElement("div");
        card.className = "prod-card";
        card.innerHTML = `
          <img src="${livroInfo.capa}">
          <p class="titulo">${livroInfo.title}</p>
          <p class="preco">${livroInfo.preco}</p>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);
      });

      attachCarouselControls(document.querySelector(".hqs-carousel"));
    } catch (e) {
      console.error("[hqs] Erro ao carregar HQs:", e);
    }
  }

  carregarHQs();

  // =======================================================
  // CONTROLES DE CARROSSEL (melhor cálculo de step e limites)
  // =======================================================
  function attachCarouselControls(containerEl) {
    if (!containerEl) return;

    const btnPrev = containerEl.querySelector(".esquerda");
    const btnNext = containerEl.querySelector(".direita");
    // procurar qualquer track válida dentro do container
    const track = containerEl.querySelector(".produtos-track, .mv-track, .recomendados-track, .romance-track, .ficcao-track, .aventura-track, .filosofia-track, .hqs-track");

    if (!track) return;

    // garantir estado inicial
    if (!track.dataset.position) {
      track.dataset.position = 0;
      track.style.transform = 'translateX(0px)';
    }
    track.style.willChange = 'transform';

    function getViewport() {
      // elemento que atua como viewport (tem overflow:hidden)
      const containerViewport = containerEl.querySelector('.produtos-track-container') || track.parentElement;
      return containerViewport;
    }

    function computeGap(trackEl, sampleCard) {
      const styles = getComputedStyle(trackEl);
      const gap = parseFloat(styles.gap || styles.columnGap || 0);
      if (gap) return Math.round(gap);
      // fallback para margem direita do card
      if (sampleCard) {
        const cardStyles = getComputedStyle(sampleCard);
        return Math.round(parseFloat(cardStyles.marginRight) || 0);
      }
      return 0;
    }

    function step() {
      const card = track.querySelector(".prod-card");
      if (!card) return 250; // fallback
      const cardW = Math.round(card.getBoundingClientRect().width);
      const gap = computeGap(track, card) || 12;
      return Math.round(cardW + gap);
    }

    function updatePosition(delta) {
      let pos = Math.round(parseFloat(track.dataset.position) || 0);
      pos += Math.round(delta);

      const viewport = getViewport();
      const viewportWidth = Math.round(viewport.getBoundingClientRect().width);
      const maxScroll = Math.max(0, Math.round(track.scrollWidth) - viewportWidth);

      // pos é negativo ao deslocar para a esquerda; limitar entre -maxScroll e 0
      pos = Math.max(-maxScroll, Math.min(0, pos));

      track.dataset.position = pos;
      // arredondar para evitar sub-pixel artifacts
      track.style.transform = `translateX(${Math.round(pos)}px)`;
    }

    // remover listeners duplicados (caso a função seja chamada múltiplas vezes)
    if (btnPrev) {
      btnPrev.replaceWith(btnPrev.cloneNode(true));
    }
    if (btnNext) {
      btnNext.replaceWith(btnNext.cloneNode(true));
    }

    const newPrev = containerEl.querySelector(".esquerda");
    const newNext = containerEl.querySelector(".direita");

    if (newPrev)
      newPrev.addEventListener("click", () => updatePosition(step()));

    if (newNext)
      newNext.addEventListener("click", () => updatePosition(-step()));

    // recalcular ao redimensionar para evitar cortes quando muda o tamanho da janela
    window.addEventListener('resize', () => {
      // reajustar posição para manter limites corretos
      const pos = Math.round(parseFloat(track.dataset.position) || 0);
      const viewport = getViewport();
      const viewportWidth = Math.round(viewport.getBoundingClientRect().width);
      const maxScroll = Math.max(0, Math.round(track.scrollWidth) - viewportWidth);
      const newPos = Math.max(-maxScroll, Math.min(0, pos));
      track.dataset.position = newPos;
      track.style.transform = `translateX(${Math.round(newPos)}px)`;
    });
  }
  // Initialize cart
  updateCartCount();
  const closeCartBtn = document.getElementById('close-cart');
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => alert('Compra finalizada!'));

  // Add to cart for livro.html
  if (window.location.pathname.includes("livro.html")) {
    const addBtn = document.querySelector('.btn-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const livroData = localStorage.getItem("livroSelecionado");
        if (!livroData) return;
        const livro = JSON.parse(livroData);
        const qty = parseInt(document.querySelector('.qty-input')?.value) || 1;
        addToCart(livro, qty);
      });
    }
  }

}); // FIM DOMContentLoaded

// =======================================================
// PESQUISA (fora do DOMContentLoaded)
// =======================================================
const searchIcon = document.getElementById("searchIcon");
const searchBox = document.getElementById("searchBox");
const searchInput = searchBox?.querySelector("input");

if (searchIcon && searchBox && searchInput) {
  searchIcon.addEventListener("click", () => {
    searchBox.classList.toggle("active");
    searchInput.focus();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query !== "")
        window.location.href = `./busca.html?query=${encodeURIComponent(query)}`;
    }
  });
}
