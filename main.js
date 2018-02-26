const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  
  const page = await browser.newPage();
//   page.once('networkidle2', () => {console.log('Page networkidle2!');});
  page.once('networkidle0', () => {console.log('Page networkidle0!');});
//   page.once('load', () =>{ console.log('Page load!');});
  
  await page.goto('http://www.aftonbladet.se/', {waitUntil: ['networkidle0'] }).then((response) =>{console.log('then ');}).catch((reason) =>{ console.error('FELET ', reason)});
  //await page.goto('http://www.aftonbladet.se/');
console.log('goto');
  console.log('scrrein');
  await page.screenshot({path: 'aftonabladet.png'}).then(()=>{console.log('scriin');});

  await browser.close();
})();
