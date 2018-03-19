const puppeteer = require('puppeteer');
//datum fix för barn
// var today = new Date();
// today.setFullYear(today.getFullYear() - 5);
// var dd = today.getDate().toString();
// var mm = (today.getMonth() + 1).toString();
// var yyyy = today.getFullYear().toString();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen', '--aggressive-cache-discard', '--disk-cache-dir="C:\Gitrepos\puppet\chromiumCache"', '--disk-cache-size=1']
  });

  const page = await browser.newPage();

  page.setViewport({
    width: 1920,
    height: 1080,
    hasTouch: false
  });


  var last = 'Arvidssön'
  var bookref = 'O32NZT'

  await page.goto('http://www.uat.flygbra.se', { waitUntil: ['networkidle0'] }).then((response) => {
    console.log('Avbokning påbörjas..');
    }).catch((reason) => {
    console.error('Kunde inte navigera till http://www.uat.flygbra.se. ', reason)
  });
  try {

    console.log('Avisa-andra-bokningar..');
    await page.waitForSelector('a[href="/medlem/visa-andra-bokningar/"]').then((ele) => {ele.click()}); // click('a[href="/visa-andra-bokningar/"]')
    await page.waitForSelector('#SearchBooking_Surname');
    console.log('Type efternamn...');
    await page.type('#SearchBooking_Surname', last, { delay: 20 });
    await page.waitForSelector('#SearchBooking_BookingReference');
    console.log('Type bokref...');
    await page.type('#SearchBooking_BookingReference', bookref, { delay: 20 });
    console.log('Klicka sök knapp...');
    await page.click('#searchBookingFormBtn');
    await page.waitFor(3000);
    await page.waitForSelector('span[data-action="REFUND"]');
    await page.waitFor(3000);
    console.log('Klicka annan knapp knapp...');
    await page.screenshot({ path: 'avbokar.png' });
    await page.click('span[data-action="REFUND"]'); //AVBOKA RESA knapp
    await page.waitFor(3000);
    await page.waitForNavigation( { waitUntil: ['networkidle0'] }).then((res)=>{console.log('Navigering genomförd')}).catch(console.error('navigeringen gick inte'))
    console.log('Klickar BEKRÄFTA AVBOKNING!');

    const but = await page.waitForSelector('button.confirm-refund');
    if(but){
      console.log('U but!!!!!');
      console.log(but);
      but.click();

    }else{console.error('No but!!!!!')}
    await page.waitFor(3000);

  } catch (error) {
    console.error('Fel ', error);
  }
  console.log('Closing browser.')
  await browser.close();
})();
