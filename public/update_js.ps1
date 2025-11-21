$jsFile = 'js/script.js'
$content = Get-Content $jsFile -Raw -Encoding UTF8

$oldCode = @"
const searchIcon = document.getElementById("searchIcon");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchBox")?.querySelector("input");

if (searchIcon && searchBox && searchInput) {
  searchIcon.addEventListener("click", () => {
    searchBox.classList.add("active");
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target) && !searchIcon.contains(e.target)) {
      searchBox.classList.remove("active");
    }
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value;
      if (query.trim()) {
        window.location.href = `/busca.html?q=$`{encodeURIComponent(query)}``;
      }
    }
  });
}
"@

$newCode = @"
const searchIcon = document.getElementById("searchIcon");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchBox")?.querySelector("input");
const searchOverlay = document.getElementById("searchOverlay");

if (searchIcon && searchBox && searchInput) {
  searchIcon.addEventListener("click", () => {
    searchBox.classList.add("active");
    if (searchOverlay) searchOverlay.classList.add("active");
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target) && !searchIcon.contains(e.target)) {
      searchBox.classList.remove("active");
      if (searchOverlay) searchOverlay.classList.remove("active");
    }
  });

  if (searchOverlay) {
    searchOverlay.addEventListener("click", () => {
      searchBox.classList.remove("active");
      searchOverlay.classList.remove("active");
    });
  }

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value;
      if (query.trim()) {
        window.location.href = `/busca.html?q=$`{encodeURIComponent(query)}``;
      }
    }
  });
}
"@

$content = $content -replace [regex]::Escape($oldCode), $newCode
$content | Out-File $jsFile -Encoding UTF8
Write-Host "JavaScript atualizado com sucesso!"
