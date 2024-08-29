// Exemplo de rota POST para salvar os resultados do quiz

const express = require('express');
const app = express();
app.use(express.json());

let quizResults = [];

app.post('/save-score', (req, res) => {
    const { userName, score, timeTaken } = req.body;
    
    // Armazenar o resultado (em memória para este exemplo)
    quizResults.push({ userName, score, timeTaken });

    res.status(200).send('Score saved successfully');
});

app.get('/ranking', (req, res) => {
    // Ordena os resultados por pontuação e tempo
    quizResults.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken);
    res.json(quizResults);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
