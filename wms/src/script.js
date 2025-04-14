import { Html5Qrcode } from "html5-qrcode";

const form = document.getElementById("form-produto");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const codigo = document.getElementById("codigo").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const descricao = document.getElementById("descricao").value;
    const rua = document.getElementById("rua").value;
    const nivel = document.getElementById("nivel").value;

    const resposta = await fetch("http://localhost:3001/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, codigo, quantidade, descricao, rua, nivel }),
    });

    if (resposta.ok) {
        mensagem.textContent = "✅ Produto cadastrado com sucesso!";
        form.reset();
        carregarProdutos();
    } else {
        mensagem.textContent = "❌ Erro ao cadastrar o produto.";
    }
});

async function carregarProdutos() {
    const resposta = await fetch("http://localhost:3001/produtos");
    const produtos = await resposta.json();

    const tbody = document.querySelector("#tabela-produtos tbody");
    tbody.innerHTML = "";

    produtos.forEach((produto) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.codigo}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.descricao}</td>
            <td>${produto.rua}</td>
            <td>${produto.nivel}</td>
            <td>
              <button class="btn btn-danger btn-sm w-100" onclick="deletarProdutoEspecifico(${produto.id})">Deletar</button>
            </td>
            `;
        tbody.appendChild(tr);
    });
}
carregarProdutos();

const iniciarLeitor = async () => {
    const qrCodeScanner = new Html5Qrcode("reader");

    try {
        await qrCodeScanner.start(
            { facingMode: "environment" }, // câmera traseira
            { fps: 10, qrbox: 250 },
            async (decodedText) => {
                console.log("Código lido:", decodedText);

                const nome = document.getElementById("nome-qr").value;
                const codigo = decodedText;
                const quantidade = 1;
                const descricao = "";
                const rua = "";
                const nivel = "";

                const resposta = await fetch("http://localhost:3001/produtos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ nome, descricao, codigo, rua, nivel, quantidade }),
                });

                if (resposta.ok) {
                    alert("Produto cadastrado com sucesso!");
                    await qrCodeScanner.stop();
                    carregarProdutos(); 
                } else {
                    alert("Erro ao cadastrar produto.");
                }
            },
            (errorMessage) => {
                console.warn("Erro de leitura:", errorMessage);
            }
        );
    } catch (err) {
        console.error("Erro ao iniciar o leitor:", err);
    }
};

window.deletarTodosProdutos = async function () {
    const resposta = await fetch("http://localhost:3001/produtos", {
        method: "DELETE",
    });
    window.confirmacao = window.confirm("Você tem certeza que deseja apagar todos os produtos?");
    if (window.confirmacao === false) {
        alert("Operação cancelada.");
        return;
    }
    const confirmacao = await fetch("http://localhost:3001/produtos", {
        method: "DELETE",
    });
    if (resposta.ok) {
        alert("Todos os produtos foram apagados!");
        carregarProdutos();
    } else {
        alert("Erro ao apagar os produtos.");
    }
};

document.getElementById("pesquisa").addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    const linhas = document.querySelectorAll("#tabela-produtos tbody tr");

    linhas.forEach((linha) => {
        const nomeProduto = linha.children[1].textContent.toLowerCase(); // coluna 1 = nome
        linha.style.display = nomeProduto.includes(termo) ? "" : "none";
    });
});


window.deletarProdutoEspecifico = async function (id) {
    const resposta = await fetch(`http://localhost:3001/produtos/${id}`, {
        method: "DELETE",
    });
    if (resposta.ok) {
        alert("Produto deletado com sucesso!");
        carregarProdutos();
    } else {
        alert("Erro ao deletar o produto.");
    }
};
