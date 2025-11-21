import express from 'express';
import path from 'path';
import bcrypt from "bcryptjs";
import { fileURLToPath } from 'url';
import { Usuario } from "./models.js";

export const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Arquivos estáticos
router.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar autenticação
const checkAuthentication = async (req, res, next) => {
  try {
    const usuarioId = req.cookies.usuarioId;

    if (usuarioId) {
      const usuario = await Usuarios.findByPk(usuarioId);
      if (usuario) {
        req.usuario = usuario;
        return next();
      }
    }

    res.status(401).json({ error: 'Não autenticado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar autenticação' });
  }
};

// Rotas SPA
const spaRoutes = [
  '/', '/login', '/cadastro'
];

spaRoutes.forEach(route => {
  router.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
});

// Verifica autenticação
router.get("/check-auth", async (req, res) => {
  try {
    const usuarioId = req.cookies.usuarioId;

    let usuario = null;

    if (usuarioId) usuario = await Usuarios.findByPk(usuarioId);

    if (usuario) {
      res.json({ authenticated: true, usuario });
    } else {
      res.json({ authenticated: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar autenticação' });
  }
});