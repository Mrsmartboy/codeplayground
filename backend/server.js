const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for code snippets
const snippets = {}; // This will hold our snippets in memory

// Generate a unique ID for each snippet (simple counter)
let currentId = 1;

// Routes

// Save a code snippet
app.post('/save', (req, res) => {
  const { html, css, js } = req.body;
  
  // Create a new snippet with a unique ID
  const id = currentId++;
  snippets[id] = { id, html, css, js, createdAt: new Date() };

  res.json({ message: 'Snippet saved successfully', id });
});

// Load a code snippet by ID
app.get('/load/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const snippet = snippets[id];

  if (!snippet) {
    return res.status(404).json({ message: 'Snippet not found' });
  }
  res.json(snippet);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
