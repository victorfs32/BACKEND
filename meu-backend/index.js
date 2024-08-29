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
      console.error('Erro ao ler o arquivo:', err);
      return res.status(500).json({ error: 'Erro ao ler o arquivo' });
    }

    let scores = [];
    if (data) {
      try {
        scores = JSON.parse(data);
      } catch (parseErr) {
        console.error('Erro ao parsear os dados do arquivo:', parseErr);
        return res.status(500).json({ error: 'Erro ao processar os dados' });
      }
    }

    // Adiciona o novo resultado
    scores.push({ userName, score, timeTaken });

    // Salva os dados no arquivo
    fs.writeFile(filePath, JSON.stringify(scores, null, 2), (err) => {
      if (err) {
        console.error('Erro ao salvar o arquivo:', err);
        return res.status(500).json({ error: 'Erro ao salvar o arquivo' });
      }
      res.status(201).json({ message: 'Pontuação salva com sucesso' });
    });
  });
});

// Endpoint para verificar a conexão
app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
