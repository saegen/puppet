var Nightmare = require('nightmare'),
  nightmare = Nightmare({
    show: true,
    height: 1080,   //window.height
    width: 1920,
    webPreferences: {
      partition: 'nopersist'
    }
  });

  
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
var bokref = 'bokref';
//Sida Alles ok till payment

nightmare  
   .goto('http://www.uat.flygbra.se')
   //.wait(1000)
   .wait('#OneWayTrip').click('#OneWayTrip')
   .click('#travelFrom').wait(1000)
   .wait('#DatePickerDeparture a.ui-datepicker-next').click('#DatePickerDeparture a.ui-datepicker-next')
   .click('#DatePickerDeparture a.ui-datepicker-next') //klick igen
   .wait(4000)
   .wait('#DatePickerDeparture a.ui-state-default').click('#DatePickerDeparture a.ui-state-default')

  .wait('#allOriginRoutes').insert('#allOriginRoutes', 'STOCKHOLM/BROMMA') // BROMMA/STOCKHOLM  STOCKHOLM/BROMMA Skriver in värdena. De selectas inte
  .wait('#destinationRoutesSection').wait(3000).insert('#destinationRoutesSection', 'MALMÖ')
  .click('#passengers').wait('#Children-Add').click('#Children-Add')
  .wait(2000)
  .wait('.blue').click('.blue')//.wait(5000)
  .wait('.bound-table-cell-reco-available') //Skulle kunna hoppa ner en rad..
  .click('.bound-table-cell-reco-available')
  .wait(3000)
  .wait('.tripsummary-price-total').click('button.tripSummary-btn-continue')
  //Går till sida 3
  .wait('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_TitleCode')
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
//  .click('#w31').wait(8000)
  //Sida 4,dvs Tillvalssidan, som man bara klickar förbi
  .wait('#service-desc-SC4').click('button.tripSummary-btn-continue') //alternativt 'span.teaserDescription' 
//   //sida 5 payment
.wait('.payment-wrapper')
.screenshot('./screenshots/empty_payment.png')
.wait(2000)
.wait('#tpl4_radio_CC').click('#tpl4_radio_CC')
.wait(1000)
.screenshot('./screenshots/empty_payment.png')
.wait(2000)
.wait('label[for="tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-ccTypesIcons-ccTypesIcons3"]')
.click('label[for="tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-ccTypesIcons-ccTypesIcons3"]')
.wait('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-cardNumber')
.insert('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-cardNumber','4541090000010073')
.wait('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-securityCode')
.insert('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-securityCode','123')
.select('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-ccMonth','8')
.select('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-ccYear','23')
.insert('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-VI-nameOnCard',nameOnCard)
.click('#widget-group-purchaseForm-termsConditionsForm-termsAndCondition > div > label')

.screenshot('./screenshots/payment.png')
.wait(2000)
.click('button.tripSummary-btn-continue')
//Anger CSV igen och klickar backtomerchant
.wait(2000)//div[id="userInput1"]
.wait('#userInput1_password').insert('#userInput1_password','123')
.screenshot('./screenshots/3DSecure.png')
  .wait(2000)
.wait('#masterForm > input[type="button"]:nth-child(4)').click('#masterForm > input[type="button"]:nth-child(4)')
.wait('#backToMerchant').click('#backToMerchant')
.wait('.recloc')
.screenshot('./screenshots/bokningsref.png')
.evaluate(() => { return document.querySelector('span.recloc').innerHTML;}) 
.then((texten) => { 
    bokref = texten
    console.log('Enkel, Malmö-Bromma. 1 ADT,1 CHD,svenska namn')
    console.log('Bokning skapad. Bokningsnr: '+ bokref + ' Efternamn: ' + adtlast );
    console.log('Avbokning påbörjas..')
    nightmare.goto('https://www.uat.flygbra.se/')
    .wait('a[href="/visa-andra-bokningar/"]').click('a[href="/visa-andra-bokningar/"]')
    .wait('#SearchBooking_Surname').insert('#SearchBooking_Surname',last)
    .wait('#SearchBooking_BookingReference').insert('#SearchBooking_BookingReference',bookref)
    .click('#searchBookingFormBtn')
    .wait('span[data-action="REFUND"]')
    .screenshot('./screenshots/hanterabokning.png')
    .click('span[data-action="REFUND"]') //AVBOKA RESA knapp
    .wait('#handleBookingButton').click('#handleBookingButton') //klickar fortsätt i modal
    .screenshot('./screenshots/sammanstallning_refund.png')
    .wait('button.confirm-refund').click('button.confirm-refund')
        .then(()=>{
            console.log('Avbokning klar för bokningsnr: ', bokref )
            console.log('Avbokning klar för: ', adtlast )
        })
        .catch((error) => {
          //nightmare.screenshot('/screenshots/error_avbokning.png')
          console.error('Fel: /screenshots/error_.png skapad. Avbokningen gick inte bra: ', error);
          return nightmare.end();
        })  
    })
  .catch((error) => {
    //nightmare.screenshot('/screenshots/error_bokning.png')
    console.error('Fel: se /screenshots/error_.png skapad. Kunde inte skapa bokning pga: ', error);
    return nightmare.end();
  }); 