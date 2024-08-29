const express = require('express');
const cors = require('cors'); // Importar o módulo cors
const app = express();
app.use(express.json());

// Configurar o middleware CORS
const corsOptions = {
    origin: 'https://www.ensinandolibras.com.br', // Seu domínio
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

let quizResults = [];

// Rota POST para salvar os resultados do quiz
app.post('/save-score', (req, res) => {
    const { userName, score, timeTaken } = req.body;

    // Armazenar o resultado (em memória para este exemplo)
    quizResults.push({ userName, score, timeTaken });

    res.status(200).send('Score saved successfully');
});

// Rota GET para obter o ranking
app.get('/ranking', (req, res) => {
    // Ordena os resultados por pontuação e tempo
    quizResults.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);
    res.json(quizResults);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
