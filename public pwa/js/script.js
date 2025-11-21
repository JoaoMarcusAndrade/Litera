// script.js — versão otimizada para a home e popup de cadastro

document.addEventListener("DOMContentLoaded", () => {
  console.log("[Littera] Script carregado");

  // ====== ELEMENTOS ======
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("close-btn");
  const overlay = document.getElementById("overlay");

  const abrirBtn = document.getElementById("abrirCadastro");
  const modal = document.getElementById("modalCadastro");
  const fecharModal = document.getElementById("fecharModal");

  const imagemInput = document.getElementById("imagem");
  const preview = document.getElementById("preview");
  const form = document.getElementById("form-cadastro");

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

  // ====== POPUP CADASTRAR ======
  if (abrirBtn && modal && fecharModal) {
    abrirBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
      document.body.style.overflow = "hidden"; // trava scroll do fundo
    });

    fecharModal.addEventListener("click", () => fecharModalCadastro());
    window.addEventListener("click", (e) => {
      if (e.target === modal) fecharModalCadastro();
    });

    function fecharModalCadastro() {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // ====== PRÉ-VISUALIZAÇÃO DE IMAGEM ======
  if (imagemInput && preview) {
    imagemInput.addEventListener("change", () => {
      const arquivo = imagemInput.files[0];
      if (arquivo) {
        const leitor = new FileReader();
        leitor.onload = (e) => (preview.src = e.target.result);
        leitor.readAsDataURL(arquivo);
      }
    });
  }

  // ====== CADASTRO DE LIVRO ======
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const livro = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        editora: document.getElementById("editora").value,
        isbn: document.getElementById("isbn").value,
        descricao: document.getElementById("descricao").value,
        condicaoGeral: document.getElementById("condicao-geral").value,
        condicaoCapa: document.getElementById("condicao-capa").value,
        condicaoPaginas: document.getElementById("condicao-paginas").value,
        imagem: preview.src,
      };

      console.log("📚 Livro cadastrado:", livro);
      // ====== SALVAR NO LOCALSTORAGE ======
      let livros = JSON.parse(localStorage.getItem("livros")) || [];
      livros.push(livro);
      localStorage.setItem("livros", JSON.stringify(livros));

      alert("Livro cadastrado com sucesso!");

      form.reset();
      preview.src = "./IMG/placeholder.png";
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  console.log("[Littera] Script inicializado com sucesso.");
});
