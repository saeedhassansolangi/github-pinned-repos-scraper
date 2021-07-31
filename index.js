const express = require('express');
const ScrapingGithub = require('./scraping-pinned-repos');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const githubData = await ScrapingGithub();
  res.send(githubData);
});

app('*', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => console.log('server is running on the port:3000'));
