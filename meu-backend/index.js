import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

// Armazenamento em memória para usuários
const users = [];

// Endpoint de teste
app.get("/", (req, res) => {
  return res.json("Hello World");
});

// Endpoint para obter todos os usuários
app.get("/users", (req, res) => {
  return res.json(users);
});

// Endpoint para criar um novo usuário
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Verifica se o nome e o e-mail foram fornecidos
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
  }

  const newUser = {
    id: Math.random().toString(36).substr(2, 9), // Gera um ID único
    name,
    email,
  };

  users.push(newUser);
  return res.json(newUser);
});

// Endpoint para excluir um usuário pelo ID
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  // Encontra o índice do usuário com o ID fornecido
  const index = users.findIndex(user => user.id === id);

  if (index < 0) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  users.splice(index, 1);
  return res.status(204).json();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
