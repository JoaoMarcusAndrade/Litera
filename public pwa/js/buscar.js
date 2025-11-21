document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalRetirada");
  const fecharBtn = document.getElementById("fecharModalRetirada");
  const confirmarBtn = document.getElementById("confirmarRetirada");
  const cancelarBtn = document.getElementById("cancelarRetirada");
  const retiradaCard = document.getElementById("retirada-card");
  const statusMsg = document.getElementById("retirada-status");

  // Função auxiliar para dados falsos realistas
  function gerarDadosFake() {
    const nomes = ["Lucas Almeida", "Ana Souza", "Marcos Oliveira", "Carla Fernandes", "Rafael Lima", "Julia Martins", "Pedro Moreira", "Beatriz Santos", "Gustavo Rocha", "Fernanda Ribeiro"];
    const livros = [
      { titulo: "A Sombra do Vento", autor: "Carlos Ruiz Zafón", editora: "Suma" },
      { titulo: "1984", autor: "George Orwell", editora: "Companhia das Letras" },
      { titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", editora: "HarperCollins" },
      { titulo: "Dom Casmurro", autor: "Machado de Assis", editora: "Martin Claret" },
      { titulo: "O Alquimista", autor: "Paulo Coelho", editora: "Rocco" },
      { titulo: "A Culpa é das Estrelas", autor: "John Green", editora: "Intrínseca" },
      { titulo: "Harry Potter e a Pedra Filosofal", autor: "J.K. Rowling", editora: "Rocco" },
      { titulo: "O Hobbit", autor: "J.R.R. Tolkien", editora: "HarperCollins" },
      { titulo: "A Menina que Roubava Livros", autor: "Markus Zusak", editora: "Intrínseca" },
      { titulo: "O Código Da Vinci", autor: "Dan Brown", editora: "Arqueiro" }
    ];

    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const livro = livros[Math.floor(Math.random() * livros.length)];
    const email = nome.toLowerCase().replace(" ", ".") + "@gmail.com";
    const telefone = `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    return { nome, email, telefone, livro };
  }

  // Exibe modal de confirmação
  function abrirModal(dados) {
    retiradaCard.innerHTML = `
      <p><strong>Livro:</strong> ${dados.livro.titulo}</p>
      <p><strong>Autor:</strong> ${dados.livro.autor}</p>
      <p><strong>Editora:</strong> ${dados.livro.editora}</p>
      <hr>
      <p><strong>Usuário:</strong> ${dados.nome}</p>
      <p><strong>Email:</strong> ${dados.email}</p>
      <p><strong>Telefone:</strong> ${dados.telefone}</p>
    `;
    modal.style.display = "block";
  }

  function fecharModal() {
    modal.style.display = "none";
  }

  // Inicia leitor QR
  function iniciarScanner() {
    const readerElem = document.getElementById("reader");
    if (!readerElem) return;
    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: 250 };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        html5QrCode.stop();
        const dados = gerarDadosFake();
        abrirModal(dados);
      },
      (error) => {}
    ).catch(() => {
      readerElem.innerHTML = '<button id="simularQR" class="btn-cadastrar">Simular leitura de QR</button>';
      document.getElementById("simularQR").onclick = () => {
        const dados = gerarDadosFake();
        abrirModal(dados);
      };
    });
  }

  // Botões modal
  fecharBtn.onclick = fecharModal;
  cancelarBtn.onclick = fecharModal;

  confirmarBtn.onclick = () => {
    statusMsg.style.color = "green";
    statusMsg.textContent = "✅ Retirada realizada com sucesso!";
    setTimeout(() => {
      fecharModal();
      window.location.href = "index.html";
    }, 2000);
  };

  // Clique fora do modal
  window.onclick = (event) => {
    if (event.target == modal) {
      fecharModal();
    }
  };

  iniciarScanner();
});
