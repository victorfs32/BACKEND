const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Caminho para os arquivos de dados
const scoresFilePath = path.join(__dirname, 'resultados.json');
const userFilePath = path.join(__dirname, 'user.json');

// Configura o CORS para permitir requisições do domínio do frontend
app.use(cors({
  origin: 'https://zingy-cocada-c2dd55.netlify.app/',
}));

app.use(express.json()); // Para interpretar JSON

// Função para ler dados do arquivo
const readFile = (filePath, defaultValue = []) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error(`Erro ao parsear o arquivo ${filePath}:`, error);
      return defaultValue;
    }
  } else {
    return defaultValue;
  }
};

// Função para salvar dados no arquivo
const writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Rota para obter as pontuações
app.get('/api/ranking', (req, res) => {
  try {
    const scores = readFile(scoresFilePath);
    res.json(scores);
  } catch (error) {
    console.error('Erro ao obter pontuações:', error);
    res.status(500).json({ message: 'Erro ao obter pontuações!' });
  }
});

// Rota para obter e salvar o nome do usuário
app.get('/api/user', (req, res) => {
  try {
    const user = readFile(userFilePath, {});
    res.json(user);
  } catch (error) {
    console.error('Erro ao obter o nome do usuário:', error);
    res.status(500).json({ message: 'Erro ao obter o nome do usuário!' });
  }
});

app.post('/api/user', (req, res) => {
  const { userName } = req.body;
  if (!userName) {
    return res.status(400).json({ message: 'Nome do usuário é obrigatório!' });
  }
  try {
    writeFile(userFilePath, { userName });
    res.json({ message: 'Nome do usuário salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar o nome do usuário:', error);
    res.status(500).json({ message: 'Erro ao salvar o nome do usuário!' });
  }
});

// Rota para salvar as pontuações
app.post('/api/scores', (req, res) => {
  const { userName, score, timeTaken } = req.body;
  if (!userName || score === undefined || timeTaken === undefined) {
    return res.status(400).json({ message: 'Dados incompletos!' });
  }

  try {
    const scores = readFile(scoresFilePath, []);
    scores.push({ userName, score, timeTaken });
    scores.sort((a, b) => a.timeTaken - b.timeTaken); // Ordenar pelo menor tempo
    writeFile(scoresFilePath, scores);
    res.json({ message: 'Pontuação salva com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar a pontuação:', error);
    res.status(500).json({ message: 'Erro ao salvar a pontuação!' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
