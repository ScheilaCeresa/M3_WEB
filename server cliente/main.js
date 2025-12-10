const API = "http://localhost:4500/dividas";
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formDivida").addEventListener("submit", cadastrarDivida);
  sincronizarPendentes();
  carregarDividas();
  setInterval(sincronizarPendentes, 30000);
});

async function cadastrarDivida(e) {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const email = document.getElementById("email").value.trim();
  const valor = document.getElementById("valor").value.trim();
  const objeto = document.getElementById("objeto").value.trim();
  const situacao = document.getElementById("situacao").value;
  if (!nome || !cpf || !email || !valor || !objeto || !situacao) {
    alert("Preencha os campos obrigatórios");
    return;
  }
  const form = new FormData(document.getElementById("formDivida"));
  try {
    const r = await fetch(API, { method: "POST", body: form });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const res = await r.json();
    document.getElementById("formDivida").reset();
    await carregarDividas();
    alert("Dívida cadastrada");
  } catch (err) {
    salvarPendente(form);
    alert("Servidor offline. Salvo no cache local.");
    listar(JSON.parse(localStorage.getItem("dividas") || "[]"));
  }
}

function salvarPendente(form) {
  const pend = JSON.parse(localStorage.getItem("pendentes") || "[]");
  const obj = {
    id: Date.now(),
    nome: form.get("nome"),
    cpf: form.get("cpf"),
    email: form.get("email"),
    cep: form.get("cep"),
    numero: form.get("numero"),
    complemento: form.get("complemento"),
    valor: parseFloat(form.get("valor")),
    objeto: form.get("objeto"),
    situacao: form.get("situacao"),
    processo: form.get("processo"),
    comprovante: null
  };
  pend.push(obj);
  localStorage.setItem("pendentes", JSON.stringify(pend));
  const lista = JSON.parse(localStorage.getItem("dividas") || "[]");
  lista.push(obj);
  localStorage.setItem("dividas", JSON.stringify(lista));
}

async function sincronizarPendentes() {
  const pend = JSON.parse(localStorage.getItem("pendentes") || "[]");
  if (!pend.length) return;
  for (let i = 0; i < pend.length; i++) {
    const p = pend[i];
    const form = new FormData();
    form.append("nome", p.nome);
    form.append("cpf", p.cpf);
    form.append("email", p.email);
    form.append("valor", p.valor);
    form.append("objeto", p.objeto);
    form.append("situacao", p.situacao);
    form.append("cep", p.cep || "");
    form.append("numero", p.numero || "");
    form.append("complemento", p.complemento || "");
    form.append("processo", p.processo || "");
    try {
      const r = await fetch(API, { method: "POST", body: form });
      if (!r.ok) throw new Error("HTTP " + r.status);
    } catch (e) {
      return;
    }
  }
  localStorage.removeItem("pendentes");
  carregarDividas();
}

async function carregarDividas() {
  try {
    const r = await fetch(API);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const dados = await r.json();
    localStorage.setItem("dividas", JSON.stringify(dados));
    listar(dados);
  } catch (e) {
    const cache = JSON.parse(localStorage.getItem("dividas") || "[]");
    listar(cache);
  }
}

function listar(lista) {
  const tabela = document.getElementById("tabelaDividas");
  tabela.innerHTML = "";
  lista.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.cliente?.nome ?? d.nome ?? ""}</td>
      <td>${d.cliente?.cpf ?? d.cpf ?? ""}</td>
      <td>R$ ${d.valor ?? ""}</td>
      <td>${d.objeto ?? ""}</td>
      <td>${d.situacao ?? ""}</td>
      <td><button onclick="excluirDivida(${d.id})">Excluir</button></td>
    `;
    tabela.appendChild(tr);
  });
}

async function excluirDivida(id) {
  try {
    const r = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    await carregarDividas();
  } catch (e) {
    let lista = JSON.parse(localStorage.getItem("dividas") || "[]");
    lista = lista.filter(d => d.id !== id);
    localStorage.setItem("dividas", JSON.stringify(lista));
    listar(lista);
    alert("Servidor offline. Removido apenas localmente.");
  }
}
