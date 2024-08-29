const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Armazena as pontuações em memória
let scores = [];

// Configura o CORS para permitir requisições do domínio do frontend
app.use(cors({
  origin: 'https://www.ensinandolibras.com.br',
}));

app.use(express.json()); // Para interpretar JSON

// Rota para obter as pontuações
app.get('/api/ranking', (req, res) => {
  res.json(scores);
});

// Rota para adicionar uma nova pontuação
app.post('/api/addScore', (req, res) => {
  const { userName, score, timeTaken } = req.body;
  if (userName && score !== undefined && timeTaken !== undefined) {
    try {
      scores.push({ userName, score, timeTaken });
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
    scores = []; // Limpa o array de pontuações
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
