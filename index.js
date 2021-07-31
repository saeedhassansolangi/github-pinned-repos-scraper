const express = require('express');
const ScrapingGithub = require('./scraping-pinned-repos');

const app = express();

app.get('/', async (req, res) => {
  const githubData = await ScrapingGithub();
  res.send(githubData);
});

app('*', (req, res) => {
  res.send(`<div style="text-align:center"> Hello World </div>`);
});

app.listen(3000, () => console.log('server is running on the port:3000'));
