const express = require('express');
const app = express();
const path = require('path')
const port = 3000;

app.use(express.json());

let alunos = [];

app.use(express.static('public'))

function alunoExiste(matricula) {
    return alunos.some(aluno => aluno.matricula === matricula);
}

app.get('/', (req, res) => {
    let pathToFile = path.join(__dirname, 'public', 'html', 'cad_aluno.html');
    res.sendFile(pathToFile);
});

app.get('/cad_alunos', (req, res) => {
    console.log('Chdegou')
    res.send('');
});

// Rota POST para registrar um novo aluno
app.post('/cad_alunos', (req, res) => {
    const { matricula, nome, email, dataNascimento } = req.body;

    if (alunoExiste(matricula)) {
        return res.status(400).json({ erro: 'Matrícula já existente!' });
    }

    const novoAluno = { matricula, nome, email, dataNascimento };
    alunos.push(novoAluno);
    res.json(novoAluno);
});

// Rota PUT para atualizar um aluno existente
app.put('/cad_alunos/:matricula', (req, res) => {
    const { matricula } = req.params;
    const { nome, email, dataNascimento } = req.body;

    const alunoIndex = alunos.findIndex(aluno => aluno.matricula === matricula);

    if (alunoIndex === -1) {
        return res.status(404).json({ erro: 'Aluno não encontrado!' });
    }

    // Verificar se a nova matrícula já pertence a outro aluno
    if (req.body.matricula && req.body.matricula !== matricula && alunoExiste(req.body.matricula)) {
        return res.status(400).json({ erro: 'Matrícula já existente!' });
    }

    alunos[alunoIndex] = { matricula, nome, email, dataNascimento };
    res.json(alunos[alunoIndex]);
});

// Rota DELETE para remover um aluno
app.delete('/cad_alunos/:matricula', (req, res) => {
    const { matricula } = req.params;
    const alunoIndex = alunos.findIndex(aluno => aluno.matricula === matricula);

    if (alunoIndex === -1) {
        return res.status(404).json({ erro: 'Aluno não encontrado!' });
    }

    const alunoRemovido = alunos.splice(alunoIndex, 1);
    res.json(alunoRemovido);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


