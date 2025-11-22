import { hash } from "bcryptjs";
import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false
});

// ============ TABELA LIVRO ============
const Livro = sequelize.define("LIVRO", {
  id_livro: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  titulo: { type: DataTypes.STRING(255), allowNull: false },
  autor: { type: DataTypes.STRING(100) },
  genero: { type: DataTypes.STRING(40) },
  estado_conservacao: { type: DataTypes.STRING(255) },
  edicao: { type: DataTypes.STRING(30) },
  nacionalidade: { type: DataTypes.STRING(20) },
  preco: { type: DataTypes.DECIMAL(10, 2) },
  metodo_aquisicao: { type: DataTypes.STRING(30) },
  reservado: { type: DataTypes.BOOLEAN, defaultValue: false },
  foto_url: { type: DataTypes.STRING(255) },
  ISBN: { type: DataTypes.CHAR(13) },
});

// ============ TABELA USUARIO ============
const Usuario = sequelize.define("USUARIO", {
  id_usuario: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome_user: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255) },
  telefone: { type: DataTypes.CHAR(11) },
  permissao: { type: DataTypes.CHAR(1), allowNull: false, defaultValue: "U" }, // U = usuario, A = admin
  senha: { type: DataTypes.STRING, allowNull: false }
});

// ============ TABELA ENDERECO ============
const Endereco = sequelize.define("ENDERECO", {
  id_endereco: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  rua: { type: DataTypes.STRING(100) },
  numero_casa: { type: DataTypes.INTEGER },
  complemento: { type: DataTypes.STRING(20) },
  bairro: { type: DataTypes.STRING(40) },
  cidade: { type: DataTypes.STRING(100) },
  estado: { type: DataTypes.CHAR(2) },
  cep: { type: DataTypes.CHAR(8) },
});

// ============ USUARIO_ENDERECO ============
const UsuarioEndereco = sequelize.define("USUARIO_ENDERECO", {}, { timestamps: false });

// Relacionamento N:N
Usuario.belongsToMany(Endereco, {
  through: UsuarioEndereco,
  foreignKey: "FK_USUARIO_id_usuario",
});
Endereco.belongsToMany(Usuario, {
  through: UsuarioEndereco,
  foreignKey: "FK_ENDERECO_id_endereco",
});

// ============ CATALOGA ============
const Cataloga = sequelize.define("CATALOGA", {
  id_catalogo: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  data_cadastro: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
});

Usuario.hasMany(Cataloga, { foreignKey: "FK_USUARIO_id_usuario" });
Livro.hasMany(Cataloga, { foreignKey: "FK_LIVRO_id_livro" });
Cataloga.belongsTo(Usuario, { foreignKey: "FK_USUARIO_id_usuario" });
Cataloga.belongsTo(Livro, { foreignKey: "FK_LIVRO_id_livro" });

// ============ PEDIDO ============
const Pedido = sequelize.define("PEDIDO", {
  id_pedido: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  data_pedido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  valor_total: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
});

Usuario.hasMany(Pedido, { foreignKey: "FK_USUARIO_id_usuario" });
Pedido.belongsTo(Usuario, { foreignKey: "FK_USUARIO_id_usuario" });

// ============ PEDIDO_LIVRO ============
const PedidoLivro = sequelize.define("PEDIDO_LIVRO", {
  id_pedido_livro: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantidade: { type: DataTypes.SMALLINT, allowNull: false },
  preco_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

Pedido.belongsToMany(Livro, {
  through: PedidoLivro,
  foreignKey: "FK_PEDIDO_id_pedido",
});
Livro.belongsToMany(Pedido, {
  through: PedidoLivro,
  foreignKey: "FK_LIVRO_id_livro",
});

// ============ PAGAMENTO ============
const Pagamento = sequelize.define("PAGAMENTO", {
  id_pagamento: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  metodo_pagamento: { type: DataTypes.STRING(20), allowNull: false },
  data_criacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  codigo_transacao: { type: DataTypes.STRING(100) },
  data_pagamento: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING(30) },
});

// Relacionamento: um pedido tem um pagamento
Pedido.hasOne(Pagamento, {
  foreignKey: "FK_PEDIDO_id_pedido",
  onDelete: "CASCADE",
});
Pagamento.belongsTo(Pedido, {
  foreignKey: "FK_PEDIDO_id_pedido",
});

// ============ PAGAMENTO_PIX ============
const PagamentoPix = sequelize.define("PAGAMENTO_PIX", {
  chave_pix: { type: DataTypes.STRING(120), allowNull: false },
  FK_PAGAMENTO_id_pagamento: { type: DataTypes.INTEGER, primaryKey: true },
});

Pagamento.hasOne(PagamentoPix, {
  foreignKey: "FK_PAGAMENTO_id_pagamento",
  onDelete: "CASCADE",
});
PagamentoPix.belongsTo(Pagamento, {
  foreignKey: "FK_PAGAMENTO_id_pagamento",
});

// ============ PAGAMENTO_CARTAO ============
const PagamentoCartao = sequelize.define("PAGAMENTO_CARTAO", {
  ultimos_digitos: { type: DataTypes.CHAR(4) },
  nome_titular: { type: DataTypes.STRING(100) },
  FK_PAGAMENTO_id_pagamento: { type: DataTypes.INTEGER, primaryKey: true },
});

Pagamento.hasOne(PagamentoCartao, {
  foreignKey: "FK_PAGAMENTO_id_pagamento",
  onDelete: "CASCADE",
});
PagamentoCartao.belongsTo(Pagamento, {
  foreignKey: "FK_PAGAMENTO_id_pagamento",
});

// ============ PAGAMENTO_BOLETO ============
const PagamentoBoleto = sequelize.define("PAGAMENTO_BOLETO", {
  codigo_boleto: { type: DataTypes.STRING(255), allowNull: false },
  data_vencimento: { type: DataTypes.DATE },
  FK_PAGAMENTO_id_pagamento: { type: DataTypes.INTEGER, primaryKey: true },
});

Pagamento.hasOne(PagamentoBoleto, {
  foreignKey: "FK_PAGAMENTO_id_pagamento",
  onDelete: "CASCADE",
});
PagamentoBoleto.belongsTo(Pagamento, {
  foreignKey: "FK_PAGAMENTO_id_pagamento",
});

export {
  sequelize,
  Livro,
  Usuario,
  Endereco,
  UsuarioEndereco,
  Cataloga,
  Pedido,
  PedidoLivro,
  Pagamento,
  PagamentoPix,
  PagamentoCartao,
  PagamentoBoleto,
};

sequelize.sync().then(() => {
  console.log("Tabelas criadas!");
});