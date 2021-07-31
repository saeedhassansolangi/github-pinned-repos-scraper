const express = require('express');
const ScrapingGithub = require('./index');

const app = express();

app.get('/', async (req, res) => {
  const githubData = await ScrapingGithub();
  res.send(githubData);
});

app.listen(3000, () => console.log('server is running on the port:3000'));
