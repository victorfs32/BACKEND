const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const resultadosPath = path.join(__dirname, 'resultados.json');

// Configura o CORS para permitir requisições do domínio do frontend
app.use(cors({
  origin: 'https://www.ensinandolibras.com.br',
}));

app.use(express.json()); // Para interpretar JSON

// Função para ler o arquivo de resultados
const readScoresFromFile = () => {
  if (fs.existsSync(resultadosPath)) {
    const fileData = fs.readFileSync(resultadosPath);
    return JSON.parse(fileData);
  } else {
    return [];
  }
};

// Função para escrever no arquivo de resultados
const writeScoresToFile = (scores) => {
  fs.writeFileSync(resultadosPath, JSON.stringify(scores, null, 2));
};

// Rota para obter as pontuações
app.get('/api/ranking', (req, res) => {
  const scores = readScoresFromFile();
  res.json(scores);
});

// Rota para adicionar uma nova pontuação
app.post('/api/addScore', (req, res) => {
  const { userName, score, timeTaken } = req.body;
  if (userName && score !== undefined && timeTaken !== undefined) {
    const scores = readScoresFromFile();
    scores.push({ userName, score, timeTaken });
    writeScoresToFile(scores);
    res.status(201).json({ message: 'Pontuação adicionada com sucesso!' });
  } else {
    res.status(400).json({ message: 'Dados inválidos!' });
  }
});

// Rota para resetar as pontuações
app.post('/api/resetScores', (req, res) => {
  writeScoresToFile([]); // Limpa o array de pontuações
  res.status(200).json({ message: 'Pontuações resetadas com sucesso!' });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
