const express = require('express');
const cors = require('cors');
const apicache = require('apicache');
const cache = apicache.middleware;

const ScrapeGithubPinnedRepos = require('./scraper');

const app = express();
app.use(cors());

// caching for 5 minutes
app.use(cache('5 minutes'));

const PORT = process.env.PORT || 3000;

app.get('/:username?/', async (req, res) => {
  const githubData = await ScrapeGithubPinnedRepos(req.params.username);
  res.send(githubData);
});

app.use('*', (req, res) => {
  res.status(404).send({
    message: 'Not Found',
  });
});

app.listen(PORT, () => console.log('server is running on the port:3000'));
