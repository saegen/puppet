const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://google.se');
  await page.screenshot({path: 'aftonbladet.png'});

  await browser.close();
})();
