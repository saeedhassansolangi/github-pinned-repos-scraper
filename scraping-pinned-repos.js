const request = require('request-promise');
const cheerio = require('cheerio');

async function ScrapingGithub() {
  try {
    // user info
    const USERNAME = 'saeedhassansolangi';
    const BASE_URL = `https://github.com`;

    // first request for fetching the "PINNED" repositories
    const response = await request(`${BASE_URL}/${USERNAME}`);
    const $ = cheerio.load(response);

    let reposURLs = [];

    $('a[class="text-bold flex-auto min-width-0 "]').each((i, el) => {
      const href = $(el).attr('href');
      reposURLs.push({ href });
    });

    let repos_meta_data = [];

    for (const URL of reposURLs) {
      // appending
      const liveUrls = [];
      const topics = [];
      const repoLanguags = [];

      const response = await request(`${BASE_URL}${URL.href}`);
      const $ = cheerio.load(response);

      // repo stars
      const starred = $('.social-count.js-social-count');
      const label = starred.attr('aria-label');
      const stars = starred.text().trim();

      const starredRepo = {
        label,
        stars,
      };

      // repo forked
      const forked = $('a[class="social-count"]');
      const forkedLabel = forked.attr('aria-label');
      const forkedCount = forked.text().trim();

      const forkked = {
        forkedCount,
        forkedLabel,
      };

      // languages
      const reooDescription = $(
        '#repo-content-pjax-container > div > div.gutter-condensed.gutter-lg.flex-column.flex-md-row.d-flex > div.flex-shrink-0.col-12.col-md-3 > div > div.BorderGrid-row.hide-sm.hide-md > div > p'
      )
        .text()
        .trim();

      $('a[class="topic-tag topic-tag-link"]').each((i, el) => {
        topics.push($(el).text().trim());
      });

      $(
        '#js-repo-pjax-container > div.hx_page-header-bg.pt-3.hide-full-screen.mb-5 > div.d-block.d-md-none.mb-2.px-3.px-md-4.px-lg-5 > div.mb-2.d-flex.flex-items-center > span > a'
      ).each((i, el) => {
        liveUrls.push($(el).attr('href'));
      });

      $(
        '#repo-content-pjax-container > div > div.gutter-condensed.gutter-lg.flex-column.flex-md-row.d-flex > div.flex-shrink-0.col-12.col-md-3 > div > div > div > ul > li > a > span.color-text-primary.text-bold.mr-1'
      ).each((i, el) => {
        const langPercentage = $(el).siblings(':last').text().trim();
        const langNames = $(el).text().trim();

        repoLanguags.push({
          langName: langNames,
          langUsed: langPercentage,
        });
      });

      repos_meta_data.push({
        forkked,
        starredRepo,
        reooDescription,
        liveUrls,
        topics,
        repoLanguags,
      });
    }
    return repos_meta_data;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = ScrapingGithub;
