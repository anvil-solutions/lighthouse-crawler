import { Crawler } from './modules/crawler/crawler.js';

// Convert this to a parameter
const START_URL = 'http://localhost:8000/';

const crawler = new Crawler(START_URL);
await crawler.crawl();
console.warn(crawler.results);
