const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

const db = new sqlite3.Database("wms.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
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

/*
                      Rota para deletar todos os produtos -->
---(NOTA IMPORTANTE) reinicie a droga do servidor apos deletar o conteudo da tabela---
*/
app.delete("/produtos", (req, res) => {
  db.serialize(() => {
    db.run("DELETE FROM produtos", function (err) {
      if (err) {
        console.error("Erro ao deletar produtos:", err.message);
        return res.status(500).json({ erro: err.message });
      }

      // Resetar o contador de ID
      db.run("DELETE FROM sqlite_sequence WHERE name = 'produtos'", function (err2) {
        if (err2) {
          console.error("Erro ao resetar ID:", err2.message);
          return res.status(500).json({ erro: err2.message });
        }

        res.json({ mensagem: "Todos os produtos foram deletados e IDs resetados." });
      });
    });
  });
});

// Rota para deletar um produto específico
// Rota para deletar um produto específico
app.delete("/produtos/:id", (req, res) => {
  const id = req.params.id;

  db.run(`DELETE FROM produtos WHERE id = ?`, id, function (err) {
    if (err) {
      console.error("Erro ao deletar produto:", err.message);
      return res.status(500).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    res.json({ mensagem: "Produto deletado com sucesso" });
  });
});


// Rota para buscar todos os produtos
app.get("/produtos", (req, res) => {
  db.all(`SELECT * FROM produtos`, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});
