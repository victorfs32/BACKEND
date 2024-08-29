const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS para permitir requisições do domínio do frontend
app.use(cors({
  origin: 'https://www.ensinandolibras.com.br',
}));

// Configuração para interpretar JSON
app.use(express.json());

// Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

let scores = []; // Array para armazenar pontuações, substitua por banco de dados em produção

// Rota para salvar a pontuação
app.post('/api/saveScore', (req, res) => {
  const { userName, score, timeTaken } = req.body;
  if (!userName || score === undefined || timeTaken === undefined) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }
  const newScore = { userName, score, timeTaken };
  scores.push(newScore);
  res.status(200).json({ message: 'Pontuação salva com sucesso!' });
});

// Rota para obter a classificação
app.get('/api/ranking', (req, res) => {
  const sortedScores = scores.sort(
    (a, b) => b.score - a.score || a.timeTaken - b.timeTaken
  );
  res.status(200).json(sortedScores);
});

// Rota raiz (opcional)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
