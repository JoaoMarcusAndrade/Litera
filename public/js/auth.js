/* auth.js - Login/Cadastro SPA usando localStorage */

const popupOverlay = document.getElementById("popupOverlay") || null;
const closePopupBtn = document.getElementById("closePopup") || null;
const loginIcon = document.getElementById("login-icon") || null;
const userNameDisplay = document.getElementById("user-name-display") || null;

const loginScreen = document.getElementById("login-screen") || null;
const cadastroScreen = document.getElementById("cadastro-screen") || null;

const loginEmail = document.getElementById("login-email") || null;
const loginSenha = document.getElementById("login-senha") || null;
const btnLogin = document.getElementById("btnLogin") || null;

const cadNome = document.getElementById("cad-nome") || null;
const cadEmail = document.getElementById("cad-email") || null;
const cadTelefone = document.getElementById("cad-telefone") || null;
const cadSenha = document.getElementById("cad-senha") || null;
const btnCadastrar = document.getElementById("btnCadastrar") || null;

const switchToRegister = document.getElementById("switchToRegister") || null;
const switchToLogin = document.getElementById("switchToLogin") || null;

function openPopup() {
  if (!popupOverlay) return;
  showLogin();
  popupOverlay.classList.add("show");
  popupOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    if (loginEmail) loginEmail.focus();
  }, 60);
}

function closePopup() {
  if (!popupOverlay) return;
  popupOverlay.classList.remove("show");
  setTimeout(() => {
    popupOverlay.style.display = "none";
    document.body.style.overflow = "";
  }, 180);
}

window.addEventListener("DOMContentLoaded", () => {
  if (location.pathname === "/login") showLogin();
  else if (location.pathname === "/cadastro") showCadastro();
});

window.addEventListener("popstate", () => {
  if (location.pathname === "/login") showLogin();
  else if (location.pathname === "/cadastro") showCadastro();
});


function showLogin() {
  if (loginScreen) loginScreen.classList.remove("hidden");
  if (cadastroScreen) cadastroScreen.classList.add("hidden");
  history.pushState(null, null, "/login");
}

function showCadastro() {
  if (cadastroScreen) cadastroScreen.classList.remove("hidden");
  if (loginScreen) loginScreen.classList.add("hidden");
  history.pushState(null, null, "/cadastro");
}


if (loginIcon) loginIcon.addEventListener("click", openPopup);
if (closePopupBtn) closePopupBtn.addEventListener("click", closePopup);

if (popupOverlay) {
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) closePopup();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popupOverlay.style.display === "flex") closePopup();
  });
}

if (switchToRegister) {
  switchToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    showCadastro();
    if (cadNome) cadNome.focus();
  });
}

if (switchToLogin) {
  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
    if (loginEmail) loginEmail.focus();
  });
}

if (btnCadastrar) {
  btnCadastrar.addEventListener("click", async () => {
    const nome = (cadNome?.value || "").trim();
    const email = (cadEmail?.value || "").trim().toLowerCase();
    const telefone = (cadTelefone?.value || "").trim();
    const senha = (cadSenha?.value || "").trim();

    if (!nome || !email || !telefone || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    if (senha.length < 6) {
      alert("Senha deve ter no mínimo 6 caracteres!");
      return;
    }

    try{
      const response = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ nome_user: nome, email, telefone, senha })
      });

      const data = await response.json();

      if (response.ok){
        alert("Cadastro realizado! Faça login.");
        showLogin();
        if (cadNome) cadNome.value = "";
        if (cadEmail) cadEmail.value = "";
        if (cadTelefone) cadTelefone.value = "";
        if (cadSenha) cadSenha.value = "";
        if (loginEmail) loginEmail.focus();
      } else {
        alert(data.error || "Erro ao cadastrar");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor");
      console.error(err)
    }
  });
}

if (btnLogin) {
  btnLogin.addEventListener("click", async () => {
    const email = (loginEmail?.value || "").trim().toLowerCase();
    const senha = (loginSenha?.value || "").trim();

    if (!email || !senha) {
      alert("Preencha email e senha!");
      return;
    }

    try{
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Bem vindo, " + data.usuario.nome_user + "!");
        closePopup();
        if (userNameDisplay) userNameDisplay.textContent = data.usuario.nome_user;
      } else {
        alert(data || "Erro no login");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor");
      console.error(err);
    }
  });
}

if (loginEmail) {
  loginEmail.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && btnLogin) btnLogin.click();
  });
}