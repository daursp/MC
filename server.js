const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Раздача CSS, JS и картинок из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Остальные страницы (about, beginners, contacts, prices, service, services)
app.get('/:page', (req, res, next) => {
  const page = req.params.page.replace('.html', '');
  const filePath = path.join(__dirname, 'views', `${page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) next(); // Если файла нет, передаём управление дальше (например, в API)
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
