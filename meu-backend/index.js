const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configura o diretório para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
