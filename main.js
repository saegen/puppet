const puppeteer = require('puppeteer');



var today = new Date();
today.setFullYear(today.getFullYear() - 5);
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

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

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-fullscreen', '--aggressive-cache-discard', '--disk-cache-dir="C:\Gitrepos\puppet\chromiumCache"', '--disk-cache-size=1']
  });

  const page = await browser.newPage();

  //  console.log('window w '5 + document.defaultView.width);
  // console.log('window h ' + document.defaultView.height);
  page.setViewport({
    width: 1920,
    height: 1080,
    hasTouch: false
  });

  //   page.once('networkidle2', () => {console.log('Page networkidle2!');});
  //   page.once('networkidle0', () => {console.log('Page networkidle0!');});
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
    console.log('then ');
  }).catch((reason) => {
    console.error('FELET ', reason)
  });
  try {
    //Ingen hemresa
    await page.click('#destination > div > div.formArea > div > div:nth-child(3) > label > div > ins');
    // Fixa utresedatum 2 månader senare
    await page.click('#travelFrom');
    await page.click('#DatePickerDeparture a.ui-datepicker-next'); //#dp1519646632844 > div > div > a.ui-datepicker-next.ui-corner-all
    await page.click('#DatePickerDeparture a.ui-datepicker-next'); //klick igen #DatePickerDeparture a.ui-datepicker-next
    await page.click('#DatePickerDeparture a.ui-state-default');
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
    await page.screenshot({
      path: 'f7_sida1.png'
    }).then(() => console.log('sida1'));
    // var nav = page.waitForNavigation({waitUntil: ['networkidle2'] });
    // await page.click('.blue');
    await page.waitFor(4000);
    await page.click('#destination > div > div.formArea > div > div.col-sm-6.col-xs-12.colFive.pull-right > button');
    console.log('Sida 1 är klar.. Går till sida 2')
    await page.waitForNavigation({
      waitUntil: "networkidle0"
    });
    // await nav;
    console.log('Sida 2 är laddad');
    await page.screenshot({
      path: 'f7_sida2.png'
    }).then(() => console.log('sida2'));
    // Väljer en resa
    // Promise<Element> availableDiv = await page.evaluate(()=> {
    const availableDiv = await page.evaluate(() => {
      const availableTrip = document.querySelector('div.bound-table-cell-reco-available');
      if (availableTrip) {
        availableTrip.click();

        return availableTrip;
      }
      throw "Kunde inte välja en resa";
    }).then(await page.waitFor(2000))
    console.log('evaluate är körd. T');
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
    console.log('Hittade resenär MR!');
    await page.select('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_TitleCode', 'MR');
    await page.type('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_FirstName', adtfirst);
    await page.type('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_LastName', adtlast);
    await page.select('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_TitleCode', 'MS');
    await page.insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_FirstName', chdfirst);
    await page.insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_LastName', chdlast);
    await page.insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateDay', dd)
    await page.select('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateMonth', mm)
    await page.type('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateYear', yyyy)
    await page.type('#tpl3_widget-input-travellerList-contactInformation-Email', mail);
    await page.type('#tpl3_widget-input-travellerList-contactInformation-EmailConfirm', mail);
    await page.type('#tpl3_widget-input-travellerList-contactInformation-PhoneMobile', mobilen).then(() => console.debug('Vi komm hit'));
    await page.screenshot({
      path: 'resenarsinfo.png'
    }).then(() => console.log('Resenärsinfo'));
    //.click('button.tripSummary-btn-continue') //#w31 funkar??
    /**
     * .wait('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_TitleCode')
  .select('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_TitleCode','MR')
  .wait('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_FirstName').insert('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_FirstName',adtfirst)
  .wait('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_LastName').insert('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_LastName',adtlast)
  .select('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_TitleCode','MS')
  .wait('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_FirstName').insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_FirstName',chdfirst)
  .wait('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_LastName').insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_LastName',chdlast)
  .wait('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateDay').insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateDay',dd)
  .select('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateMonth',mm)
  .wait('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateYear').insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateYear',yyyy)
  .wait('#tpl3_widget-input-travellerList-contactInformation-Email').insert('#tpl3_widget-input-travellerList-contactInformation-Email',mail)
  .wait('#tpl3_widget-input-travellerList-contactInformation-EmailConfirm').insert('#tpl3_widget-input-travellerList-contactInformation-EmailConfirm',mail)
  .wait('#tpl3_widget-input-travellerList-contactInformation-PhoneMobile').insert('#tpl3_widget-input-travellerList-contactInformation-PhoneMobile',mobilen)
  .screenshot('./screenshots/resenarsinfo.png')
  .wait(3000)
  .click('button.tripSummary-btn-continue') //#w31 funkar??
     */

  } catch (error) {
    console.error('Fel ', error);
  }

  //   await page.waitForNavigation();
  await browser.close();
})();