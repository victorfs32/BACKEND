  const express = require('express');
  const cors = require('cors');
  const fs = require('fs');
  const path = require('path');
  const app = express();
  const port = process.env.PORT || 3000;

  // Caminho para o arquivo de pontuações
  const scoresFilePath = path.join(__dirname, 'resultados.json');

  // Configura o CORS para permitir requisições do domínio do frontend
  app.use(cors({
    origin: 'https://www.ensinandolibras.com.br',
  }));

  app.use(express.json()); // Para interpretar JSON

  // Função para ler as pontuações do arquivo
  const readScoresFromFile = () => {
    if (fs.existsSync(scoresFilePath)) {
      const data = fs.readFileSync(scoresFilePath, 'utf8');
      return JSON.parse(data);
    } else {
      return [];
    }
  };

  // Função para salvar as pontuações no arquivo
  const saveScoresToFile = (scores) => {
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2), 'utf8');
  };

  // Rota para obter as pontuações
  app.get('/api/ranking', (req, res) => {
    try {
      const scores = readScoresFromFile();
      res.json(scores);
    } catch (error) {
      console.error('Erro ao obter pontuações:', error);
      res.status(500).json({ message: 'Erro ao obter pontuações!' });
    }
  });

  // Rota para salvar uma nova pontuação
  app.post('/api/ranking', (req, res) => {
    try {
      const newScore = req.body;
      const scores = readScoresFromFile();
      scores.push(newScore);
      saveScoresToFile(scores);
      res.status(201).json({ message: 'Pontuação salva com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
      res.status(500).json({ message: 'Erro ao salvar pontuação!' });
    }
  });

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
