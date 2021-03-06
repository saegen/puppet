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


  var adtlast = 'Arvidssön';
  var bokref = 'O7GBKH';

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
    await page.type('#SearchBooking_Surname', adtlast, { delay: 20 });
    await page.waitForSelector('#SearchBooking_BookingReference');
    console.log('Type bokref...');
    await page.type('#SearchBooking_BookingReference', bokref, { delay: 20 });
    console.log('HÄMTA BOKNINGAR...');
    await page.waitForSelector('#searchBookingFormBtn').then((btn)=>{
      console.log('Klickar HÄMTA BOKNINGAR');
      btn.click();
    }).catch((err)=> {throw new Error('Kund inte klicka HÄMTA BOKNINGAR')});
    await page.waitFor(3000);
    console.log('AVBOKA RESA...');
    await page.waitForSelector('span[data-action="REFUND"]').then((btn)=>{
      console.log('Klickar AVBOKA RESA');
      btn.click();}).catch((err)=> {throw new Error('Kund inte klicka AVBOKA RESA')});
    await page.waitFor(3000);
    await page.screenshot({ path: 'avbokar.png' }).then(() => console.log('screenshot avbokar.png'));;
        await page.waitForNavigation( { waitUntil: ['networkidle0'] }).then((res)=>{console.log('Navigering genomförd')}).catch(console.error('navigeringen gick inte'))

    const but = await page.waitForSelector('button.confirm-refund');
    if(but){
      console.log('Klickar BEKRÄFTA AVBOKNING!');
      but.click();
    }else{
      throw new Error('Kunde inte klicka BEKRÄFTA AVBOKNIN');
    }
    await page.waitFor(5000);

  } catch (error) {
    console.error('Fel ', error);
  }
  console.log('Closing browser.')
  await browser.close();
})();
