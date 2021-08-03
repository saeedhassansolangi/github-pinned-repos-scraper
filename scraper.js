const request = require('request-promise');
const cheerio = require('cheerio');

async function ScrapeGithubPinnedRepos(USERNAME = 'saeedhassansolangi') {
  try {
    const BASE_URL = `https://github.com`;

    // first request for fetching the "PINNED" repositories of the user
    const response = await request(`${BASE_URL}/${USERNAME}`);
    const $ = cheerio.load(response);

    let reposURLs = [];

    $('a[class="text-bold flex-auto min-width-0 "]').each((i, el) => {
      const href = $(el).attr('href');
      reposURLs.push({ href });
    });

    let repos_meta_data = [];

    for (const URL of reposURLs) {
      const response = await request(`${BASE_URL}${URL.href}`);
      const $ = cheerio.load(response);

      const live_urls = [];
      const topics = [];
      const lang_stats = [];

      // repo stars
      const starred = $('.social-count.js-social-count');
      const starred_repo_info = {
        starred_count: starred.text().trim(),
        starred_label: starred.attr('aria-label'),
      };

      // repo forked
      const forked = $('a[class="social-count"]');
      const forked_repo_info = {
        forked_count: forked.text().trim(),
        forked_label: forked.attr('aria-label'),
      };

      // languages
      const repo_description = $(
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
        live_urls.push($(el).attr('href'));
      });

      $(
        '#repo-content-pjax-container > div > div.gutter-condensed.gutter-lg.flex-column.flex-md-row.d-flex > div.flex-shrink-0.col-12.col-md-3 > div > div > div > ul > li > a > span.color-text-primary.text-bold.mr-1'
      ).each((i, el) => {
        lang_stats.push({
          lang_name: $(el).text().trim(),
          lang_percentage: $(el).siblings(':last').text().trim(),
          lang_color: $(el).prev().css('color'),
        });
      });

      const repo_name = URL.href.split('/')[2];
      const repo_url = `${BASE_URL}${URL.href}`;

      repos_meta_data.push({
        repo_name,
        repo_url,
        forked_repo_info,
        starred_repo_info,
        repo_description,
        live_urls,
        topics,
        lang_stats,
      });
    }

    return repos_meta_data;
  } catch (error) {
    console.log(error.message);
    return { message: 'something went wrong' };
  }
}

module.exports = ScrapeGithubPinnedRepos;
