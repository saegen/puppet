const puppeteer = require('puppeteer');
//datum fix för barn
var today = new Date();
today.setFullYear(today.getFullYear() - 5);
var dd = today.getDate().toString();
// dds: string = today.getDate().toString();
// mms: string = today.getMonth().toString();
var mm = (today.getMonth() + 1).toString(); //January is 0!
var yyyy = today.getFullYear().toString();

var adtfirst = 'Östen';
var adtlast = 'Åkesson';
var chdfirst = 'Söggla';
var chdlast = 'Själmare';
var mail = 'saegen@hotmail.com';
//kort 4541090000010073
var nameOnCard = adtfirst + ' ' + adtlast;
var mobilen = '737111777';
//ALLA
var bokref = 'bokref saknas';
//Sida Alles ok till payment
function testa() {
  console.log(today.toISOString().substr(0, 10))
}

function pickRandomDay(sel){
  const days = document.querySelectorAll(sel);
  let elem = null;
  if (days.length > 0) {
      elem = days[parseInt(days.length/2)];
      elem.click();
      return true;
  }
   throw new Error('Kunde inte hitta något avresedatum!')
}

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

  page.once('load', () => {
    testa();
    console.log('Page load!');
  });
  // Funkar inte..
  page.on('console', (msg) => {
    for (let i = 0; i < msg.args.length; ++i)
      console.log(`${i}: ${msg.args[i]}`);
  });

  await page.goto('http://www.uat.flygbra.se', {
    waitUntil: ['networkidle2']
  }).then((response) => {
    console.log('goto klar..')
  }).catch((reason) => {
    console.error('FELET ', reason)
  });
  try {
    //Ingen hemresa
    await page.click('#destination > div > div.formArea > div > div:nth-child(3) > label > div > ins');
    // Fixa utresedatum 2 månader senare
    await page.click('#travelFrom');
    await page.click('#DatePickerDeparture a.ui-datepicker-next').then(await page.click('#DatePickerDeparture a.ui-datepicker-next'));
    //tar en dag mitt i månaden för att försöka undvika att det kommer saknas resor den dagen.
    await page.evaluate(pickRandomDay,'#DatePickerDeparture  a.ui-state-default');
    // Anger Från och Till
    await page.click('#allOriginRoutes');
    await page.type('#allOriginRoutes', 'STOCKHOLM/BROMMA', {
      delay: 20
    }); // BROMMA/STOCKHOLM  STOCKHOLM/BROMMA Skriver in värdena. De selectas inte
    await page.click('#destinationRoutesSection');
    await page.type('#destinationRoutesSection', 'MALMÖ', {
      delay: 20
    });
    // Ange barnpassagerare
    await page.click('#passengers');
    await page.click('#Children-Add');
    await page.screenshot({ path: 'f7_sida1.png' }).then(() => console.log('screenshot sida1'));

    // Gå till sida 2
    await page.click('#destination > div > div.formArea > div > div.col-sm-6.col-xs-12.colFive.pull-right > button');
    await page.waitFor(2000);
    console.log('Går till sida 2...')
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    // await nav;
    console.log('Sida 2 är laddad');
    await page.screenshot({ path: 'f7_sida2.png' }).then(() => console.log('screenshot sida2'));
    // Väljer en resa
    await page.waitForSelector('div.bound-table-cell-reco-available').catch((err) => {
      throw new Error("Kunde hitta tillgängliga resor detta datum, försök ett annat datum")
     //Fel sidan: #global-error-message //#dp1520350372387 > div > table > tbody > tr:nth-child(2) > td:nth-child(5) > a
      // klicka "Ändra sökning" : modifySearch > a:nth-child(1), älle div.modifySearch > a
      // byt månad
      // klick fortsätt igen

      }
    );


    const availableDiv = await page.evaluate(() => {
      const availableTrip = document.querySelector('div.bound-table-cell-reco-available');
      if (availableTrip) {
        availableTrip.click();
        return availableTrip;
      }
      throw new Error("Kunde inte välja en resa");
    }).then(await page.waitFor(2000))
    console.log('evaluate är körd.');
    await page.screenshot({
      path: 'f7_sida3.png'
    }).then(() => console.log('Screenshot: f7_sida3'));
    await page.click('button.tripSummary-btn-continue');
    console.log('knapptryckt');
    // await page.waitForNavigation({
    //   waitUntil: "networkidle0"
    // });
    await page.waitFor(2000);
    console.log('Väntar på resenär...');
    await page.waitForSelector('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_TitleCode');
    console.log('Hittade resenär: Man MR!');
    await page.select('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_TitleCode', 'MR');

    await page.type('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_FirstName', adtfirst, { delay: 20 });
    console.log('Vuxen förnamn');
    await page.type('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_LastName', adtlast, { delay: 20 });
    console.log('Vuxen efternamn');
    await page.select('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_TitleCode', 'MS');
    console.log('Flicka MS');
    await page.type('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_FirstName', chdfirst, { delay: 20 });
    console.log('Barn förnamn');
    await page.type('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_LastName', chdlast, { delay: 20 });
    console.log('Barn efternamn');
    await page.type('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateDay', dd, { delay: 20 });
    console.log('Barn dag');
    await page.select('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateMonth', mm)
    console.log('Barn månad');
    await page.type('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateYear', yyyy, { delay: 20 });
    console.log('Barn år');
    await page.type('#tpl3_widget-input-travellerList-contactInformation-Email', mail, { delay: 20 });
    console.log('Mail 1');
    await page.type('#tpl3_widget-input-travellerList-contactInformation-EmailConfirm', mail, { delay: 20 });
    console.log('Mail 2');
    await page.type('#tpl3_widget-input-travellerList-contactInformation-PhoneMobile', mobilen).then(() => console.debug('Mobilen. Resenär ifylld!'));

    await page.screenshot({ path: 'resenarsinfo.png' }).then(() => console.log('Resenärsinfo klar se resenarsinfo.png'));

    await page.click('button.tripSummary-btn-continue');
    await page.waitFor(10000)
    await page.waitForSelector('button.tripSummary-btn-continue');
    await page.click('button.tripSummary-btn-continue');
    await page.waitFor(8000);
  } catch (error) {
    await page.screenshot('ERROR.png');
    console.error('Fel ', error);
  }

  //   await page.waitForNavigation();
  await browser.close();
})();

/**
 * #global-warning-message - selector när man inte hittar resa.
 *
 */