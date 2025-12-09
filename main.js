const API = "http://localhost:4500/dividas";

async function cadastrarDivida(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const valor = document.getElementById("valor").value.trim();
    const objeto = document.getElementById("objeto").value.trim();
    const situacao = document.getElementById("situacao").value;

    const cep = document.getElementById("cep").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const complemento = document.getElementById("complemento").value.trim();
    const processo = document.getElementById("processo").value.trim();
    const comprovante = document.getElementById("comprovante").files[0];

    if (!nome || !cpf || !email || !valor || !objeto || !situacao) {
        alert("Preencha os campos obrigatórios");
        return;
    }

    const form = new FormData();
    form.append("nome", nome);
    form.append("cpf", cpf);
    form.append("email", email);
    form.append("valor", valor);
    form.append("objeto", objeto);
    form.append("situacao", situacao);
    form.append("cep", cep);
    form.append("numero", numero);
    form.append("complemento", complemento);
    form.append("processo", processo);
    if (comprovante) form.append("comprovante", comprovante);

    try {
        const r = await fetch(API, {
            method: "POST",
            body: form
        });
        const dados = await r.json();
        await carregarDividas();
        document.getElementById("formDivida").reset();
        alert("Dívida cadastrada");
    } catch (e) {
        salvarLocalmente(form);
        alert("Servidor offline. Salvo no cache local.");
    }
}

function salvarLocalmente(form) {
    const lista = JSON.parse(localStorage.getItem("dividas") || "[]");
    const nova = {
        id: Date.now(),
        cliente: {
            nome: form.get("nome"),
            cpf: form.get("cpf"),
            email: form.get("email")
        },
        endereco: {
            cep: form.get("cep"),
            numero: form.get("numero"),
            complemento: form.get("complemento")
        },
        valor: parseFloat(form.get("valor")),
        objeto: form.get("objeto"),
        situacao: form.get("situacao"),
        processo: form.get("processo"),
        comprovante: null
    };
    lista.push(nova);
    localStorage.setItem("dividas", JSON.stringify(lista));
    listarLocal();
}

async function carregarDividas() {
    try {
        const r = await fetch(API);
        const dados = await r.json();
        localStorage.setItem("dividas", JSON.stringify(dados));
        listarLocal();
    } catch (e) {
        listarLocal();
    }
}

function listarLocal() {
    const tabela = document.getElementById("tabelaDividas");
    tabela.innerHTML = "";
    const lista = JSON.parse(localStorage.getItem("dividas") || "[]");

    lista.forEach(divida => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${divida.cliente.nome}</td>
            <td>${divida.cliente.cpf}</td>
            <td>${divida.valor}</td>
            <td>${divida.objeto}</td>
            <td>${divida.situacao}</td>
            <td>
                <button onclick="excluirDivida(${divida.id})" class="btnExcluir">Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

async function excluirDivida(id) {
    try {
        await fetch(`${API}/${id}`, { method: "DELETE" });
        await carregarDividas();
    } catch (e) {
        let lista = JSON.parse(localStorage.getItem("dividas") || "[]");
        lista = lista.filter(d => d.id !== id);
        localStorage.setItem("dividas", JSON.stringify(lista));
        listarLocal();
        alert("Servidor offline. Removido apenas localmente.");
    }
}

carregarDividas();
