



/* auth.js - Login/Cadastro SPA usando localStorage
   Abre modal no Login por padrão; troca para Cadastro via link.
*/

const popupOverlay = document.getElementById("popupOverlay");
const closePopupBtn = document.getElementById("closePopup");
const loginIcon = document.getElementById("login-icon");
const userNameDisplay = document.getElementById("user-name-display");

// telas
const loginScreen = document.getElementById("login-screen");
const cadastroScreen = document.getElementById("cadastro-screen");

// login inputs e botão
const loginEmail = document.getElementById("login-email");
const loginSenha = document.getElementById("login-senha");
const btnLogin = document.getElementById("btnLogin");

// cadastro inputs e botão
const cadNome = document.getElementById("cad-nome");
const cadEmail = document.getElementById("cad-email");
const cadTelefone = document.getElementById("cad-telefone");
const cadSenha = document.getElementById("cad-senha");
const btnCadastrar = document.getElementById("btnCadastrar");

// links de troca
const switchToRegister = document.getElementById("switchToRegister");
const switchToLogin = document.getElementById("switchToLogin");

// -----------------------
// abrir / fechar modal
// -----------------------
function openPopup() {
  showLogin(); // garante que abra no Login por padrão
  popupOverlay.classList.add("show");
  popupOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    // focus no primeiro campo do login
    if (loginEmail) loginEmail.focus();
  }, 60);
}

function closePopup() {
  popupOverlay.classList.remove("show");
  setTimeout(() => {
    popupOverlay.style.display = "none";
    document.body.style.overflow = "";
  }, 180);
}

loginIcon.addEventListener("click", openPopup);
closePopupBtn.addEventListener("click", closePopup);

// fechar clicando fora da caixa
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) closePopup();
});

// fechar com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && popupOverlay.style.display === "flex") closePopup();
});

// -----------------------
// trocar telas
// -----------------------
function showLogin() {
  loginScreen.classList.remove("hidden");
  cadastroScreen.classList.add("hidden");
}

function showCadastro() {
  cadastroScreen.classList.remove("hidden");
  loginScreen.classList.add("hidden");
}

switchToRegister.addEventListener("click", (e) => {
  e.preventDefault();
  showCadastro();
  if (cadNome) cadNome.focus();
});

switchToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  showLogin();
  if (loginEmail) loginEmail.focus();
});

// -----------------------
// util: ler/salvar usuarios
// -----------------------
function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios") || "[]");
}
function saveUsuarios(arr) {
  localStorage.setItem("usuarios", JSON.stringify(arr));
}

// -----------------------
// cadastro
// -----------------------
btnCadastrar.addEventListener("click", () => {
  const nome = (cadNome.value || "").trim();
  const email = (cadEmail.value || "").trim().toLowerCase();
  const telefone = (cadTelefone.value || "").trim();
  const senha = (cadSenha.value || "").trim();

  if (!nome || !email || !telefone || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  // valida email simples
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Email inválido!");
    return;
  }

  const usuarios = getUsuarios();
  if (usuarios.find(u => u.email === email)) {
    alert("Esse email já está cadastrado!");
    return;
  }

  const novo = { nome, email, telefone, senha };
  usuarios.push(novo);
  saveUsuarios(usuarios);

  // logar automaticamente
  localStorage.setItem("usuarioLogado", JSON.stringify(novo));
  atualizarUsuarioExibicao();
  closePopup();

  // limpa campos
  cadNome.value = "";
  cadEmail.value = "";
  cadTelefone.value = "";
  cadSenha.value = "";
});

// -----------------------
// login
// -----------------------
btnLogin.addEventListener("click", () => {
  const email = (loginEmail.value || "").trim().toLowerCase();
  const senha = (loginSenha.value || "").trim();

  if (!email || !senha) {
    alert("Preencha email e senha!");
    return;
  }

  const usuarios = getUsuarios();
  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (!user) {
    alert("Email ou senha incorretos!");
    return;
  }

  localStorage.setItem("usuarioLogado", JSON.stringify(user));
  atualizarUsuarioExibicao();
  closePopup();

  loginEmail.value = "";
  loginSenha.value = "";
});

// permitir Enter no login (pressionar Enter faz login)
[loginEmail, loginSenha].forEach(input => {
  if (!input) return;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnLogin.click();
  });
});

// -----------------------
// estado do usuário no header
// -----------------------
function atualizarUsuarioExibicao() {
  const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  if (user && user.nome) {
    userNameDisplay.textContent = user.nome.split(" ")[0]; // primeiro nome
    userNameDisplay.style.display = "block";
  } else {
    userNameDisplay.textContent = "";
    userNameDisplay.style.display = "none";
  }
}

// logout via clique direito no ícone (ou você pode modificar para um botão no menu)
// clique direito para sair (como você tinha antes)
loginIcon.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  if (!user) return;
  if (confirm("Deseja sair da sua conta?")) {
    localStorage.removeItem("usuarioLogado");
    atualizarUsuarioExibicao();
  }
});

// inicialização
document.addEventListener("DOMContentLoaded", () => {
  // garante que por padrão abra no login caso algum código chame openPopup()
  showLogin();
  atualizarUsuarioExibicao();
});
