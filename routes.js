import express from 'express';
import path from 'path';
import bcrypt from "bcryptjs";
import { fileURLToPath } from 'url';
import { Usuario } from "./models.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Arquivos estáticos
router.use(express.static(path.join(__dirname, 'public')));

// Rotas SPA
const spaRoutes = [
  '/', '/login', '/cadastro'
];

spaRoutes.forEach(route => {
  router.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
});

//  ROTAS DA API
router.post('/api/cadastro', async (req, res) => {
  try {
    const { nome_user, email, telefone, senha } = req.body;

    const hash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome_user,
      email,
      telefone,
      senha: hash
    });

    res.json({ ok: true, usuario });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao cadastrar' });
  }
});

router.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) return res.status(401).json({ error: 'Email não encontrado' });

    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) return res.status(401).json({ error: 'Senha inválida' });

    res.cookie("id_usuario", usuario.id_usuario, {
      httpOnly: true,
      sameSite: 'lax'
    });

    res.json({ ok: true, usuario });
  } catch (e) {
    res.status(500).json({ error: 'Erro no login' });
  }
});

const checkAuth = async (req, res, next) => {
  try {
    const id = req.cookies.id_usuario;
    if (!id) return res.status(401).json({ error: "Não autenticado" });

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(401).json({ error: "Não autenticado" });

    req.usuario = usuario;
    next();
  } catch {
    res.status(500).json({ error: "Erro ao verificar auth" });
  }
};

router.get("/api/check-auth", checkAuth, (req, res) => {
  res.json({ authenticated: true, usuario: req.usuario });
});


export default router;