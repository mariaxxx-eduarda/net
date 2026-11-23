// Bloqueia acesso se não for Administrador
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
if (!usuarioLogado || !usuarioLogado.isAdmin) {
    alert('Acesso permitido apenas para administradores!');
    window.location.href = 'index.html';
}

let listaUsuarios = [];

function sair() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// GET - Lista todos os usuários
function listarTodos() {
    document.getElementById('campoBuscaCPF').value = '';
    fetch('/pessoas')
        .then(resposta => resposta.json())
        .then(dados => {
            listaUsuarios = dados;
            preencherTabela(dados);
        })
        .catch(() => alert('Erro ao carregar usuários do servidor.'));
}

// Busca por CPF
function buscarPorCPF() {
    const cpf = document.getElementById('campoBuscaCPF').value.trim();
    if (!cpf) {
        listarTodos();
        return;
    }

    fetch('/pessoas')
        .then(resposta => resposta.json())
        .then(dados => {
            listaUsuarios = dados;
            const encontrados = dados.filter(p => p.cpf && p.cpf.includes(cpf));
            if (encontrados.length === 0) {
                alert('Nenhum usuário encontrado com este CPF.');
            }
            preencherTabela(encontrados);
        });
}

function preencherTabela(lista) {
    const tabelaCorpo = document.getElementById('tabela-corpo');
    tabelaCorpo.innerHTML = '';

    lista.forEach(objeto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${objeto.id}</td>
            <td>${objeto.nome || ''}</td>
            <td>${objeto.sobrenome || ''}</td>
            <td>${objeto.cpf || ''}</td>
            <td>${objeto.email || ''}</td>
            <td>${objeto.senha || ''}</td>
            <td>${objeto.rua || ''}</td>
            <td>${objeto.cep || objeto.CEP || ''}</td>
            <td>${objeto.cidade || ''}</td>
            <td>${objeto.estado || ''}</td>
            <td>${objeto.telefone || ''}</td>
            <td>
                <button type="button" class="btn-editar" onclick="carregarEdicao('${objeto.id}')">Editar</button>
                <button type="button" class="btn-perigo" onclick="deletarDados('${objeto.id}')">Apagar</button>
            </td>
        `;
        tabelaCorpo.appendChild(tr);
    });
}

// Prepara formulário de edição (PUT) usando os dados já carregados
function carregarEdicao(id) {
    const pessoa = listaUsuarios.find(p => String(p.id) === String(id));

    if (!pessoa) {
        alert('Usuário não encontrado para edição.');
        return;
    }

    document.getElementById('areaEdicao').style.display = 'block';
    document.getElementById('identificador').value = pessoa.id;
    document.getElementById('identificadorCPF').value = pessoa.cpf || '';
    document.getElementById('nomeAtualizar').value = pessoa.nome || '';
    document.getElementById('sobrenomeAtualizar').value = pessoa.sobrenome || '';
    document.getElementById('emailAtualizar').value = pessoa.email || '';
    document.getElementById('senhaAtualizar').value = pessoa.senha || '';
    document.getElementById('ruaAtualizar').value = pessoa.rua || '';
    document.getElementById('cepAtualizar').value = pessoa.cep || pessoa.CEP || '';
    document.getElementById('cidadeAtualizar').value = pessoa.cidade || '';
    document.getElementById('estadoAtualizar').value = pessoa.estado || '';
    document.getElementById('telefoneAtualizar').value = pessoa.telefone || '';

    document.getElementById('areaEdicao').scrollIntoView({ behavior: 'smooth' });
}

function cancelarEdicao() {
    document.getElementById('areaEdicao').style.display = 'none';
}

// PUT - Salva edição
function atualizarDados() {
    const id = document.getElementById('identificador').value;
    const dadosEditados = {
        cpf: document.getElementById('identificadorCPF').value,
        nome: document.getElementById('nomeAtualizar').value,
        sobrenome: document.getElementById('sobrenomeAtualizar').value,
        email: document.getElementById('emailAtualizar').value,
        senha: document.getElementById('senhaAtualizar').value,
        rua: document.getElementById('ruaAtualizar').value,
        cep: document.getElementById('cepAtualizar').value,
        cidade: document.getElementById('cidadeAtualizar').value,
        estado: document.getElementById('estadoAtualizar').value,
        telefone: document.getElementById('telefoneAtualizar').value
    };

    fetch(`/pessoas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosEditados)
    })
    .then(resposta => {
        if (!resposta.ok) throw new Error('Erro ao atualizar');
        return resposta.json();
    })
    .then(() => {
        alert('Dados atualizados com sucesso!');
        cancelarEdicao();
        listarTodos();
    })
    .catch(() => alert('Erro ao salvar alterações no servidor.'));
}

// DELETE - Apaga usuário
function deletarDados(id) {
    if (confirm('Deseja realmente apagar este usuário?')) {
        fetch(`/pessoas/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('Usuário apagado com sucesso!');
            listarTodos();
        });
    }
}

// Carrega a lista ao abrir a página
listarTodos();