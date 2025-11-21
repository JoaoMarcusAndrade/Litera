document.addEventListener("DOMContentLoaded", () => {
  const resultBox = document.getElementById("info");
  const stopBtn = document.getElementById("stop-scan");
  let html5QrCode;

  async function buscarLivro(codigo) {
    resultBox.innerText = "Buscando livro...";
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${codigo}`);
      const dados = await res.json();
      if (!dados.items || !dados.items.length) {
        resultBox.innerText = "Nenhum livro encontrado 😕";
        return;
      }
      const livro = dados.items[0].volumeInfo;
      resultBox.innerHTML = `
        <b>Título:</b> ${livro.title}<br>
        <b>Autor:</b> ${(livro.authors || ["Desconhecido"]).join(", ")}<br>
        <b>Editora:</b> ${livro.publisher || "—"}<br>
        <b>ISBN:</b> ${livro.industryIdentifiers?.[0]?.identifier || "—"}<br>
      `;
    } catch (e) {
      console.error(e);
      resultBox.innerText = "Erro ao buscar livro.";
    }
  }




  
  function iniciarScanner() {
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        html5QrCode.stop();
        resultBox.innerText = `Código lido: ${decodedText}`;
        buscarLivro(decodedText);
      },
      (error) => {
        // erros de leitura são comuns — não precisa logar sempre
      }
    ).catch(err => {
      console.error("Erro ao iniciar câmera:", err);
      resultBox.innerText = "Erro ao acessar câmera.";
    });
  }

  iniciarScanner();

  stopBtn.addEventListener("click", () => {
    if (html5QrCode) html5QrCode.stop();
  });
});


