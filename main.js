var fs = require('fs');
const puppeteer = require('puppeteer');
//datum fix för barn
var today = new Date();
today.setFullYear(today.getFullYear() - 5);
var dd = today.getDate().toString();
// dds: string = today.getDate().toString();
// mms: string = today.getMonth().toString();
var mm = (today.getMonth() + 1).toString(); //January is 0!
var yyyy = today.getFullYear().toString();

var adtfirst = 'Örjanten';
var adtlast = 'aFramesten';
var chdfirst = 'Ärla';
var chdlast = 'Åsbrink';
var mail = 'saegen@hotmail.com';
// var mail = 'tomas.hesse@consid.se';
//kort 4541090000010073
var nameOnCard = adtfirst + ' ' + adtlast;
var mobilen = '703835979';
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
    waitUntil: ['networkidle0']
  }).then((response) => {
    console.log('goto klar..')
    page.waitFor(2000);
  }).catch((reason) => {
    console.error('FELET ', reason)
  });
  try {
    //Ingen hemresa
    await page.waitFor(6000);
    await page.waitForSelector('#destination > div > div.formArea > div > div:nth-child(3) > label > div > ins');
    await page.click('#destination > div > div.formArea > div > div:nth-child(3) > label > div > ins');
    // Fixa utresedatum 2 månader senare
    await page.waitForSelector('#travelFrom').then(page.click('#travelFrom'));
    await page.click('#DatePickerDeparture a.ui-datepicker-next').then(await page.click('#DatePickerDeparture a.ui-datepicker-next'));
    //tar en dag mitt i månaden för att försöka undvika att det kommer saknas resor den dagen.
    await page.evaluate(pickRandomDay,'#DatePickerDeparture  a.ui-state-default');
    // Anger Från och Till
    await page.click('#allOriginRoutes');
    await page.type('#allOriginRoutes', 'STOCKHOLM/BROMMA', { delay: 20 }); // BROMMA/STOCKHOLM  STOCKHOLM/BROMMA Skriver in värdena. De selectas inte
    await page.click('#destinationRoutesSection');
    await page.type('#destinationRoutesSection', 'MALMÖ', { delay: 20 });
    // Ange barnpassagerare
    await page.click('#passengers');
    await page.click('#Children-Add');
    await page.screenshot({ path: 'f7_sida1.png' }).then(() => console.log('screenshot sida1'));

    // Gå till sida 2
    await page.click('#destination > div > div.formArea > div > div.col-sm-6.col-xs-12.colFive.pull-right > button');
    await page.waitFor(2000);
    console.log('Går till sida 2...')
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 12000 });
    // await nav;
    console.log('Sida 2 är laddad');
    await page.screenshot({ path: 'f7_sida2.png' }).then(() => console.log('screenshot sida2'));
    // Väljer en resa
    //Alternativ till att kasta fel. leta efter  #global-error-message //#dp1520350372387 > div > table > tbody > tr:nth-child(2) > td:nth-child(5) > a
      // leta efter och klicka "Ändra sökning" : modifySearch > a:nth-child(1), älle div.modifySearch > a
      // byt månad
      // klick fortsätt igen och börja om
    await page.waitForSelector('div.bound-table-cell-reco-available').catch((err) => {
      throw new Error("Kunde hitta tillgängliga resor detta datum, försök ett annat datum.")
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

    await page.screenshot({ path: 'resenarsinfo.png' }).then(() => console.log('Resenärsinfo klar. Går till sida 4..'));
    await page.click('button.tripSummary-btn-continue');
    await page.waitFor(10000)
    await page.waitForSelector('button.tripSummary-btn-continue');

    console.log('Sida 4 laddad. Går till sida 5 Betalning...')
    await page.screenshot({ path: 'f7_sida4.png' }).then(() => console.log('Screenshot: f7_sida4'));
    await page.click('button.tripSummary-btn-continue');
    await page.waitForSelector('#tpl4_radio_CC');

    console.log('Sida 5 Betalning laddad')
    await page.click('#tpl4_radio_CC');
    await page.click('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-ccTypesIcons > div:nth-child(4) > label'); // #tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-cardNumber
    await page.waitForSelector('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-cardNumber');
    await page.type('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-cardNumber','4541090000010073');
    await page.type('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-securityCode','123')
    await page.select('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-ccMonth','5')
    await page.select('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-ccYear','22')
    await page.type('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-nameOnCard',nameOnCard);
    await page.click('#widget-group-purchaseForm-termsConditionsForm-termsAndCondition > div > label')
    await page.screenshot({ path: 'betalning.png' }).then(() => console.log('Betalning klar. Går till 3Dsecure..'));

  //   page.on('frameattached',(a)=>{
  //     console.log('frameattached frames count: ' + page.frames.length);
  //     // console.log('iframe Attached eventhandler!');
  //     // console.log('Frame (ACS Test Page) title: ' + a.title());
  //     a.title().then((title) => {console.log('Frame (ACS Test Page) title: ' + title);})
  //     console.log('Name: ',a.name());
  //     console.log('Url: ',a.url());
  //     a.waitForSelector('#userInput1_password').then(()=>{console.log(H)}).catch((err) => {console.error('Kunde inte hitta userInput1_password')});

  // })
    await page.click('button.tripSummary-btn-continue')
    // .wait('#tpl4_radio_CC').click('#tpl4_radio_CC')
    await page.waitForNavigation({waitUntil: 'networkidle0', timeout: 60000}).catch((err)=> { throw new Error('waitForNavigation fixck timeout')});
    console.log('Förbi waitForNavigation! ');
    await page.screenshot({ path: '3dsecure.png' }).then(() => console.log('Screenshot: 3dsecure.png'));

  // page.on('framedetached',(a)=>{
  //   console.log('iframe Detached!! ',a.name());
  // })
  //await page.waitFor(80000);
    const frames = page.frames();
    // console.log('Före selectwait. frames count1: ' + frames.length);

    await page.waitForSelector('iframe[src*=DisplayViewVBV]').catch((err)=>{throw new Error('Kunde inte hitta frame med [src*=DisplayViewVBV :( ')});
    console.log('selectWait klar loop');
    const pageFrames = page.frames();
    let aFrame = null;
    for (let index = 0; index < pageFrames.length; index++) {
      console.log('loop url: ' + pageFrames[index].url() + ' ' + index);
      await pageFrames[index].title().then((title) => {
        console.log('loop title: ' + title + ' , index: ' + index);
        if (title === 'ACS Test Page') {
          console.log('title === ACS Test Page.Sätter frame');
          aFrame = pageFrames[index];
          aFrame.waitForSelector('#userInput1_password').then(()=>{console.log('hittade input i loopen!')} ).catch((err)=> {console.error('Kunde inte hitta userInput1_password')})
        }else{
          console.log('title === ACS Test Page.Sätter frame');
        }

      }).catch((err)=>{console.error('Fel titel ',err)});

      // if (aFrame) {
      //   console.log('aFrame väntar på #userInput1_password...' );
      //   await aFrame.waitForSelector('#userInput1_password').then(console.log('hittade input!') ).catch((err)=> {console.error('Kunde inte hitta pw')})
      // }else{ console.error('Frame tilldelning funkar ej!!')}


      // console.log('Num Frame kids' + element.childFrames().length);
      // console.log("CONTENT");
      // element.content().then((val) => fs.writeFileSync('./content' + index + '.html',val )).catch((err) => {throw new Error('kunde inte spara filen content' + index + '.html')})
      console.log('content' + index + '.html är OK' );

      // console.log("Url o content frame slut");
    };
    pageFrames[1].waitForSelector('#userInput1_password').then(()=>{console.log('hittade input i hårda!')} ).catch((err)=> {console.error('Kunde inte hitta hårda userInput1_password')});
    // const runnerFrame = pageFrames.find(frame => frame.url().includes('DisplayViewVBV'));

    // console.log(runnerFrame.url()); // runnerFrame is in page.frames()
    await page.waitFor(8000);

    // await dumpFrameTree(page, page.mainFrame(), '');


  } catch (error) {
    await page.screenshot('ERROR.png');
    console.error('Fel ', error);
  }

  //   await page.waitForNavigation();
  await browser.close();
})();

// async function dumpFrameTree(frame, indent) {
//   console.log(indent + frame.url());
//   // let content = await frame.content();
//   console.log(content);
//   const result = await frame.evaluate(() => {
//       let retVal = '';
//       if (document.doctype) {
//           retVal = new XMLSerializer().serializeToString(document.doctype);
//       }
//       if (document.documentElement) {
//           retVal += document.documentElement.outerHTML;
//       }
//       return retVal;
//   });
//   console.log(indent + "  " + result.slice(0, 20));
//   for (let child of frame.childFrames()) {
//       await dumpFrameTree(child, indent + '  ');
//   }
// }


// async function dumpFrameTree(page, frame, indent) {
//   console.log(indent + frame.url());
//   const result = await frame.evaluate(() => {
//       let retVal = '';
//       if (document.doctype) {
//           retVal = new XMLSerializer().serializeToString(document.doctype);
//       }
//       if (document.documentElement) {
//           retVal += document.documentElement.outerHTML;
//       }
//       return retVal;
//   });
//   console.log(indent + "  " + result.slice(0, 20));
//   for (let child of frame.childFrames()) {
//       await dumpFrameTree(page, child, indent + '  ');
//   }
// }
