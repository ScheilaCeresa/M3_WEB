const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const mysql = require("mysql2");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("/home/joao/Área de trabalho/M3_WEB/server cliente"));

const db = mysql.createConnection({
  host: "localhost",
  user: "server",
  password: "Senha@123",
  database: "dividas_db"
});

db.connect(err => {
  if (err) console.log("Erro ao conectar MySQL:", err);
  else console.log("MySQL conectado.");
});

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

const caminhoJSON = "dividas.json";
if (!fs.existsSync(caminhoJSON)) fs.writeFileSync(caminhoJSON, "[]");

app.get("/dividas", (req, res) => {
  db.query("SELECT * FROM dividas", (err, results) => {
    if (!err) {
      const dados = results.map(r => ({
        id: r.id,
        cliente: { nome: r.nome, cpf: r.cpf, email: r.email },
        endereco: { cep: r.cep, numero: r.numero, complemento: r.complemento },
        valor: parseFloat(r.valor),
        objeto: r.objeto,
        situacao: r.situacao,
        processo: r.processo,
        comprovante: r.comprovante
      }));
      return res.json(dados);
    }
    const dados = JSON.parse(fs.readFileSync(caminhoJSON));
    res.json(dados);
  });
});

app.post("/dividas", upload.single("comprovante"), (req, res) => {
  const { nome, cpf, email, valor, objeto, situacao, cep, numero, complemento, processo } = req.body;
  if (!nome || !cpf || !email || !valor || !objeto || !situacao) return res.status(400).json({ erro: "Campos obrigatórios faltando." });
  const nova = {
    id: Date.now(),
    cliente: { nome, cpf, email },
    endereco: { cep, numero, complemento },
    valor: parseFloat(valor),
    objeto,
    situacao,
    processo,
    comprovante: req.file ? req.file.filename : null
  };
  const dados = JSON.parse(fs.readFileSync(caminhoJSON));
  dados.push(nova);
  fs.writeFileSync(caminhoJSON, JSON.stringify(dados, null, 2));
  const sql = "INSERT INTO dividas (id,nome,cpf,email,cep,numero,complemento,valor,objeto,situacao,processo,comprovante) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const valores = [nova.id, nome, cpf, email, cep, numero, complemento, nova.valor, objeto, situacao, processo, nova.comprovante];
  db.query(sql, valores, err => {
    if (err) console.log("Erro SQL:", err);
  });
  res.json({ mensagem: "Dívida cadastrada.", divida: nova });
});

app.delete("/dividas/:id", (req, res) => {
  const id = Number(req.params.id);
  let dados = JSON.parse(fs.readFileSync(caminhoJSON));
  dados = dados.filter(d => d.id !== id);
  fs.writeFileSync(caminhoJSON, JSON.stringify(dados, null, 2));
  db.query("DELETE FROM dividas WHERE id = ?", [id], err => {
    if (err) console.log("Erro SQL:", err);
  });
  res.json({ mensagem: "Dívida removida." });
});

app.listen(4500, () => console.log("Servidor rodando na porta 4500"));


app.get("/", (req,res) => {
  res.sendFile("index.html")
})
