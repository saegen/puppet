const puppeteer = require('puppeteer');

var today = new Date();
 today.setFullYear(today.getFullYear() -5);
 var dd = today.getDate();
 var mm = today.getMonth()+1; //January is 0!
 var yyyy = today.getFullYear();

 var adtfirst = 'Östen';
 var adtlast = 'Åkesson';
 var chdfirst = 'Söggla';
 var chdlast = 'Själmare';
 var mail = 'duine77@hotmail.com';
 //kort 4541090000010073
 var nameOnCard = adtfirst + ' ' + adtlast;
 var mobilen = '737111777';
 //ALLA
var bokref = 'bokref saknas';
//Sida Alles ok till payment


(async () => {
  const browser = await puppeteer.launch({headless: false});
  
  const page = await browser.newPage();
//   page.once('networkidle2', () => {console.log('Page networkidle2!');});
  page.once('networkidle0', () => {console.log('Page networkidle0!');});
   page.once('load', () => console.log('Page load!'));
  
  await page.goto('http://www.uat.flygbra.se', {waitUntil: ['networkidle2'] }).then((response) =>{console.log('then ');}).catch((reason) =>{ console.error('FELET ', reason)});
    console.log('scrrein');
  await page.screenshot({path: 'flyg.png'}).then(()=> console.log('scriin'));

  await browser.close();
})();
