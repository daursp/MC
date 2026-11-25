'use strict';

const path = require('node:path');
const express = require('express');

try {
  process.loadEnvFile();
} catch {
  // .env не обязателен: значения по умолчанию заданы ниже.
}

require('./models/initDatabase');
const apiRouter = require('./routes/api');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, '..', 'public');

app.use(express.json());
app.use(express.static(publicDir));

const pages = {
  '/': 'index.html',
  '/catalog': 'catalog.html',
  '/about': 'about.html',
  '/contacts': 'contacts.html',
};

Object.entries(pages).forEach(([url, file]) => {
  app.get(url, (req, res) => res.sendFile(path.join(publicDir, file)));
});

app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

app.listen(PORT, () => {
  console.log(`«Мягкая сила» запущена: http://localhost:${PORT}`);
});
