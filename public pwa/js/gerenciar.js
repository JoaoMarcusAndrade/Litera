// gerenciar.js — controle da página de gerenciamento

document.addEventListener("DOMContentLoaded", () => {
  console.log("[Littera] Gerenciar carregado");

  const listaLivros = document.getElementById("lista-livros");
  const modal = document.getElementById("modal-editar");
  const fecharEditar = document.getElementById("fechar-editar");
  const formEditar = document.getElementById("form-editar");

  let livros = JSON.parse(localStorage.getItem("livros")) || [];
  let livroEditandoIndex = null;

  // ---------- renderizar ----------
  function renderizar() {
    listaLivros.innerHTML = "";
    if (livros.length === 0) {
      listaLivros.innerHTML = "<p class='vazio'>Nenhum livro cadastrado ainda.</p>";
      return;
    }

    livros.forEach((livro, i) => {
      const card = document.createElement("div");
      card.className = "card-livro";
      card.innerHTML = `
        <img src="${livro.imagem || './IMG/placeholder.png'}" alt="${livro.titulo}" class="capa-livro">
        <div class="info-livro">
          <h3>${livro.titulo}</h3>
          <p><strong>Autor:</strong> ${livro.autor}</p>
          <p><strong>Editora:</strong> ${livro.editora}</p>
          <p><strong>ISBN:</strong> ${livro.isbn || '—'}</p>
          <div class="acoes">
            <button class="btn-editar" data-index="${i}"><i class="fa-solid fa-pen"></i> Editar</button>
            <button class="btn-excluir" data-index="${i}"><i class="fa-solid fa-trash"></i> Excluir</button>
          </div>
        </div>
      `;
      listaLivros.appendChild(card);
    });
  }

  renderizar();

  // ---------- excluir ----------
  listaLivros.addEventListener("click", (e) => {
    if (e.target.closest(".btn-excluir")) {
      const index = e.target.closest(".btn-excluir").dataset.index;
      if (confirm("Deseja realmente excluir este livro?")) {
        livros.splice(index, 1);
        localStorage.setItem("livros", JSON.stringify(livros));
        renderizar();
      }
    }
  });

  // ---------- abrir modal editar ----------
  listaLivros.addEventListener("click", (e) => {
    if (e.target.closest(".btn-editar")) {
      const index = e.target.closest(".btn-editar").dataset.index;
      livroEditandoIndex = index;
      const livro = livros[index];

      document.getElementById("editar-titulo").value = livro.titulo;
      document.getElementById("editar-autor").value = livro.autor;
      document.getElementById("editar-editora").value = livro.editora;
      document.getElementById("editar-isbn").value = livro.isbn;
      document.getElementById("editar-descricao").value = livro.descricao;

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });

  // ---------- fechar modal ----------
  fecharEditar.addEventListener("click", fecharModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });

  function fecharModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ---------- salvar alterações ----------
  formEditar.addEventListener("submit", (e) => {
    e.preventDefault();
    if (livroEditandoIndex === null) return;

    const atualizado = {
      ...livros[livroEditandoIndex],
      titulo: document.getElementById("editar-titulo").value,
      autor: document.getElementById("editar-autor").value,
      editora: document.getElementById("editar-editora").value,
      isbn: document.getElementById("editar-isbn").value,
      descricao: document.getElementById("editar-descricao").value,
    };

    livros[livroEditandoIndex] = atualizado;
    localStorage.setItem("livros", JSON.stringify(livros));

    alert("Livro atualizado com sucesso!");
    fecharModal();
    renderizar();
  });


   // ====== MENU LATERAL ======
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
});
