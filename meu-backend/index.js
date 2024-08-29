const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Configura o CORS para permitir requisições do domínio do frontend
app.use(cors({
  origin: 'https://www.ensinandolibras.com.br',
}));

app.use(express.json()); // Para parsear JSON no corpo das requisições
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para salvar as pontuações
app.post('/scores', (req, res) => {
  const { userName, score, timeTaken } = req.body;
  
  if (!userName || score === undefined || timeTaken === undefined) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  // Caminho para o arquivo JSON
  const filePath = path.join(__dirname, 'resultados.json');

  // Ler os dados existentes
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Erro ao ler o arquivo' });
    }

    let scores = [];
    if (data) {
      scores = JSON.parse(data);
    }

    // Adiciona o novo resultado
    scores.push({ userName, score, timeTaken });

    // Salva os dados no arquivo
    fs.writeFile(filePath, JSON.stringify(scores, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar o arquivo' });
      }
      res.status(201).json({ message: 'Pontuação salva com sucesso' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
