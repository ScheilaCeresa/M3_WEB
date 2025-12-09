const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Servidor Web funcionando!");
});

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

const caminhoJSON = "dividas.json";

if (!fs.existsSync(caminhoJSON)) {
    fs.writeFileSync(caminhoJSON, "[]");
}

app.get("/dividas", (req, res) => {
    const dados = JSON.parse(fs.readFileSync(caminhoJSON));
    res.json(dados);
});

app.post("/dividas", upload.single("comprovante"), (req, res) => {
    const { nome, cpf, email, valor, objeto, situacao, cep, numero, complemento, processo } = req.body;

    if (!nome || !cpf || !email || !valor || !objeto || !situacao) {
        return res.status(400).json({ erro: "Campos obrigatórios faltando." });
    }

    const dados = JSON.parse(fs.readFileSync(caminhoJSON));

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

    dados.push(nova);
    fs.writeFileSync(caminhoJSON, JSON.stringify(dados, null, 2));

    res.json({ mensagem: "Dívida cadastrada.", divida: nova });
});

app.delete("/dividas/:id", (req, res) => {
    const id = Number(req.params.id);
    let dados = JSON.parse(fs.readFileSync(caminhoJSON));
    dados = dados.filter(d => d.id !== id);
    fs.writeFileSync(caminhoJSON, JSON.stringify(dados, null, 2));
    res.json({ mensagem: "Dívida removida." });
});

app.listen(4500, () => {
    console.log("Servidor rodando na porta 4500");
});
