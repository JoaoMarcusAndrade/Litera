// =======================================================
// script.js - Versão com integração livro.html via LocalStorage
// =======================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("[script] DOM carregado");

  // ---------- utilidades ----------
  function qs(id) { return document.getElementById(id); }
  function safeText(id, text) { const el = qs(id); if (el) el.innerText = text; }

  // =======================================================
  // FUNÇÃO GLOBAL PARA CRIAR EVENTO DE CLIQUE EM LIVROS
  // =======================================================
  function aplicarCliqueLivro(card, livroInfo) {
    if (!card) return;

    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      localStorage.setItem("livroSelecionado", JSON.stringify(livroInfo));
      window.location.href = "livro.html";
    });
  }

// ---------- MENU LATERAL + OVERLAY ----------
  const menuBtn = qs('menu-btn');
  const sidebar = qs('sidebar');
  const closeBtn = qs('close-btn');

  if (menuBtn && sidebar && closeBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.style.width = '320px';
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      console.log("[menu] aberto");
    });

    function fecharMenu() {
      sidebar.style.width = '0';
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      console.log("[menu] fechado");
    }

    closeBtn.addEventListener('click', fecharMenu);
    overlay.addEventListener('click', fecharMenu);

  } else {
    console.warn("[menu] elementos não encontrados.");
  }



  // =======================================================
  // FUNÇÃO PARA CARREGAR LIVRO NO livro.html
  // =======================================================
  if (window.location.pathname.includes("livro.html")) {
    const livroData = localStorage.getItem("livroSelecionado");

    if (!livroData) {
      safeText("livro-titulo", "Livro não encontrado");
      return;
    }

    const livro = JSON.parse(livroData);

    // Preencher os dados
    safeText("livro-autor", livro.authors?.join(", ") || livro.autor || "Autor desconhecido");
    safeText("livro-paginas", livro.pageCount || livro.paginas || "--");
    safeText("livro-editora", livro.publisher || livro.editora || "Desconhecida");
    safeText("livro-isbn", livro.isbn || "Não informado");
    safeText("livro-preco", livro.preco || "39,90");
    safeText("livro-descricao", livro.description || livro.descricao || "Sem descrição disponível.");


    const capaEl = qs("livro-capa");
    if (capaEl) capaEl.src = livro.capa || "https://via.placeholder.com/260x380.png?text=Sem+Capa";

    safeText("livro-preco", livro.preco || "R$ 39,90");

    carregarSemelhantes(livro.authors?.[0] || livro.title);

  }

  // =======================================================
  // FUNÇÃO PARA CARREGAR LIVROS SEMELHANTES
  // =======================================================
  async function carregarSemelhantes(autorOuTitulo) {
    const container = qs("livros-similares");
    if (!container) return;

    try {
      const q = encodeURIComponent(`inauthor:${autorOuTitulo}`);
      const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=6`;

      const resposta = await fetch(url);
      const dados = await resposta.json();

      container.innerHTML = "";

      if (!dados.items) {
        container.innerHTML = "<p>Nenhum livro semelhante encontrado.</p>";
        return;
      }

      dados.items.forEach(item => {
        const info = item.volumeInfo;
        if (!info) return;

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
        card.classList.add("book");
        card.innerHTML = `
          <img src="${livroInfo.capa || "https://via.placeholder.com/150x220.png"}">
          <div class="book-title">${livroInfo.title}</div>
          <div class="stars">★★★★★</div>
          <div class="book-price">${livroInfo.preco}</div>
        `;

        aplicarCliqueLivro(card, livroInfo);
        container.appendChild(card);
      });
    } catch (erro) {
      console.error("[carregarSemelhantes] ERRO:", erro);
    }
  }

  // =======================================================
  // CARREGAR CARROSSEL PRINCIPAL (PRODUTOS)
  // =======================================================
  async function carregarProdutos() {
    const track = document.querySelector(".produtos-track");
    const indicadores = document.querySelector(".produtos-indicadores");

    if (!track) return;

    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&langRestrict=pt&maxResults=10`;
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
          <div class="titulo">${livroInfo.title}</div>
          <div class="preco">${livroInfo.preco}</div>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);

        const dot = document.createElement("span");
        dot.className = "prod-dot";
        if (i === 0) dot.classList.add("active");
        indicadores.appendChild(dot);
      });

      iniciarCarrosselProdutos();
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
    const indicadores = document.querySelector(".mv-indicadores");

    const url = "https://www.googleapis.com/books/v1/volumes?q=popular&maxResults=12";

    try {
      const resp = await fetch(url);
      const data = await resp.json();

      track.innerHTML = "";
      indicadores.innerHTML = "";

      data.items.forEach((livro, index) => {
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
        card.classList.add("prod-card");
        card.innerHTML = `
          <img src="${livroInfo.capa}" alt="${livroInfo.title}">
          <p class="titulo">${livroInfo.title}</p>
        `;

        aplicarCliqueLivro(card, livroInfo);
        track.appendChild(card);

        const dot = document.createElement("span");
        dot.classList.add("mv-dot");
        if (index === 0) dot.classList.add("ativo");
        dot.dataset.index = index;
        indicadores.appendChild(dot);
      });

      iniciarCarrosselMV();
    } catch (erro) {
      console.log("ERRO carregando Mais Vendidos:", erro);
    }
  }

  carregarMaisVendidos();

}); // FIM DOMContentLoaded

// =======================================================
// PESQUISA
// =======================================================
const searchIcon = document.getElementById("searchIcon");
const searchBox = document.getElementById("searchBox");

searchIcon?.addEventListener("click", () => {
  searchBox.classList.toggle("active");
});



document.addEventListener("DOMContentLoaded", () => {
  console.log("[script] DOM carregado");

  function qs(id) { return document.getElementById(id); }

  // ---------- LIVROS POPULARES ----------
  const livrosPopulares = [
    {
      id: 1,
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      capa: "img/livros/domcasmurro.jpg",
      descricao: "Um dos maiores clássicos da literatura brasileira...",
      editora: "Editora Clássicos",
      isbn: "9788533302286",
      paginas: 256,
      preco: "29.90"
    },
    {
      id: 2,
      titulo: "Memórias Póstumas de Brás Cubas",
      autor: "Machado de Assis",
      capa: "img/livros/bras_cubas.jpg",
      descricao: "A obra mais inovadora de Machado...",
      editora: "Editora Nacional",
      isbn: "9788533302279",
      paginas: 240,
      preco: "32.90"
    }
  ];

  // ELEMENTO DO CARROSSEL
  const container = document.querySelector(".livros-container");
  if (!container) {
    console.error("[script] .livros-container não encontrado.");
    return;
  }

  container.innerHTML = livrosPopulares.map(livro => `
    <div class="livro-card" onclick='abrirLivro(${JSON.stringify(livro).replace(/"/g, '&quot;')})'>
      <img src="${livro.capa}" alt="${livro.titulo}">
      <h3>${livro.titulo}</h3>
      <p>${livro.autor}</p>
    </div>
  `).join("");

  // FUNÇÃO QUE ENVIA O LIVRO PARA O livro.html
  window.abrirLivro = function (livro) {
    localStorage.setItem("livroSelecionado", JSON.stringify(livro));
    window.location.href = "livro.html";
  };
});
