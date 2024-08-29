const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const resultsFilePath = path.join(__dirname, 'results.json');

// Configura o CORS para permitir requisições do domínio do frontend
app.use(cors({
  origin: 'https://www.ensinandolibras.com.br',
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Função para ler resultados do arquivo JSON
const readResultsFromFile = () => {
  if (fs.existsSync(resultsFilePath)) {
    const data = fs.readFileSync(resultsFilePath, 'utf8');
    return JSON.parse(data);
  }
  return [];
};

// Função para salvar resultados no arquivo JSON
const saveResultsToFile = (results) => {
  fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2), 'utf8');
};

// Endpoint para salvar os resultados
app.post('/scores', (req, res) => {
  const { userName, score, timeTaken } = req.body;
  const results = readResultsFromFile();
  results.push({ userName, score, timeTaken });
  saveResultsToFile(results);
  res.status(201).send('Score saved');
});

// Endpoint para recuperar resultados
app.get('/scores', (req, res) => {
  const results = readResultsFromFile();
  res.json(results);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
