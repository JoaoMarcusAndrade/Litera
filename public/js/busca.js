const resultados = document.getElementById("resultados");
const resultadoCountEl = document.getElementById("resultado-count");
const urlParams = new URLSearchParams(window.location.search);
const query = (urlParams.get("query") || "").trim();

if (!query) {
  if (resultadoCountEl) resultadoCountEl.textContent = "";
  if (resultados) resultados.innerHTML = "<p>Nenhuma pesquisa informada.</p>";
} else {
  // mostra a query no topo (se houver elemento)
  const qEl = document.getElementById('busca-query');
  if (qEl) qEl.textContent = `"${query}"`;

  buscarLivros();
}

async function buscarLivros() {
  try {
    resultados.innerHTML = "<p>Carregando...</p>";
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=pt&maxResults=20`;
    const resp = await fetch(url);
    const dados = await resp.json();

    if (!dados.items || dados.items.length === 0) {
      if (resultadoCountEl) resultadoCountEl.textContent = "0 resultados";
      resultados.innerHTML = "<p>Nenhum livro encontrado.</p>";
      return;
    }

    resultados.innerHTML = "";
    if (resultadoCountEl) resultadoCountEl.textContent = `${dados.items.length} resultado(s)`;

    dados.items.forEach((livro) => {
      const info = livro.volumeInfo || {};

      const preco = `R$ ${(Math.random() * 40 + 10).toFixed(2)}`;
      const capa = info.imageLinks?.thumbnail || './img/placeholder.png';

      const card = document.createElement("div");
      card.className = "prod-card";

      card.innerHTML = `
        <img src="${capa}" alt="${escapeHtml(info.title || 'Capa')}">
        <p class="titulo">${escapeHtml(info.title || 'Título indisponível')}</p>
        <p class="preco">${preco}</p>
      `;

      card.addEventListener("click", () => {
        const livroData = {
          id: livro.id,
          title: info.title,
          titulo: info.title,
          authors: info.authors || [],
          autor: (info.authors || []).join(", "),
          description: info.description || "Sem descrição disponível.",
          descricao: info.description || "Sem descrição disponível.",
          capa: capa,
          imagem: capa,
          imageLinks: info.imageLinks || {},
          preco: preco,
          publisher: info.publisher || "Editora Desconhecida",
          publicador: info.publisher || "Editora Desconhecida",
          publishedDate: info.publishedDate || "Data desconhecida",
          dataPublicacao: info.publishedDate || "Data desconhecida",
          pageCount: info.pageCount || "Desconhecido",
          paginas: info.pageCount || "Desconhecido",
          isbn: info.industryIdentifiers?.[0]?.identifier || "N/A"
        };

        localStorage.setItem("livroSelecionado", JSON.stringify(livroData));
        window.location.href = "./livro.html";
      });

      resultados.appendChild(card);
    });
  } catch (err) {
    if (resultadoCountEl) resultadoCountEl.textContent = "";
    resultados.innerHTML = "<p>Erro ao buscar livros.</p>";
    console.error(err);
  }
}

// pequena função de escape para evitar inserção de HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}