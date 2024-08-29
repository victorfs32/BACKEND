const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Caminho para o arquivo de resultados
const resultadosPath = path.join(__dirname, 'resultados.json');

// Configura o CORS para permitir requisições do domínio do frontend
app.use(cors({
  origin: 'https://www.ensinandolibras.com.br',
}));

app.use(express.json()); // Para interpretar JSON

// Função para ler o arquivo de resultados
const readScoresFromFile = () => {
  try {
    if (fs.existsSync(resultadosPath)) {
      const fileData = fs.readFileSync(resultadosPath);
      return JSON.parse(fileData);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erro ao ler o arquivo de resultados:', error);
    return [];
  }
};

// Função para escrever no arquivo de resultados
const writeScoresToFile = (scores) => {
  try {
    fs.writeFileSync(resultadosPath, JSON.stringify(scores, null, 2));
    console.log('Pontuações salvas com sucesso!');
  } catch (error) {
    console.error('Erro ao escrever no arquivo de resultados:', error);
  }
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
    try {
      const scores = readScoresFromFile();
      scores.push({ userName, score, timeTaken });
      writeScoresToFile(scores);
      res.status(201).json({ message: 'Pontuação adicionada com sucesso!' });
    } catch (error) {
      console.error('Erro ao adicionar pontuação:', error);
      res.status(500).json({ message: 'Erro ao adicionar pontuação!' });
    }
  } else {
    res.status(400).json({ message: 'Dados inválidos!' });
  }
});

// Rota para resetar as pontuações
app.post('/api/resetScores', (req, res) => {
  try {
    writeScoresToFile([]); // Limpa o array de pontuações
    res.status(200).json({ message: 'Pontuações resetadas com sucesso!' });
  } catch (error) {
    console.error('Erro ao resetar pontuações:', error);
    res.status(500).json({ message: 'Erro ao resetar pontuações!' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
