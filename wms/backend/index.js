const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express(); // mover antes do uso
const port = 3001;

app.use(cors()); // agora aparece só uma vez
app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

const db = new sqlite3.Database("wms.db");

// Cria tabela (se não existir)
db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS produtos`);
  db.run(`
    CREATE TABLE produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      codigo TEXT,
      quantidade INTEGER,
      descricao TEXT,
      rua TEXT,
      nivel TEXT
    )
  `);
});

// Rota para inserir produto
app.post("/produtos", (req, res) => {
  const { nome, codigo, quantidade, descricao, rua, nivel } = req.body;

  if (!nome || !codigo || quantidade == null) {
    return res.status(400).json({ erro: "Campos obrigatórios não preenchidos" });
  }

  const sql = `INSERT INTO produtos (nome, codigo, quantidade, descricao, rua, nivel)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [nome, codigo, quantidade, descricao, rua, nivel];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Erro ao inserir produto:", err.message);
      return res.status(500).json({ erro: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Rota para buscar todos os produtos
app.get("/produtos", (req, res) => {
  db.all(`SELECT * FROM produtos`, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});
