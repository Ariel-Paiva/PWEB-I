require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

// Schema e Model
const TaskSchema = new mongoose.Schema({
  texto: String,
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', TaskSchema);

// ROTAS ----------------------------

// GET - listar tarefas
app.get('/tarefas', async (req, res) => {
  const tarefas = await Task.find();
  res.json(tarefas);
});

// POST - adicionar tarefa
app.post('/tarefas', async (req, res) => {
  const novaTarefa = new Task({ texto: req.body.texto });
  await novaTarefa.save();
  res.json(novaTarefa);
});

// DELETE - remover tarefa
app.delete('/tarefas/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// ----------------------------------

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.put('/tarefas/:id', async (req, res) => {
  const { completed } = req.body;

  const tarefa = await Task.findByIdAndUpdate(
    req.params.id,
    { completed },
    { new: true }
  );

  res.json(tarefa);
});