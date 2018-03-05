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
 var dd = today.getDate();
 var mm = today.getMonth()+1; //January is 0!
 var yyyy = today.getFullYear() - 5;

 //Sida Alles ok till payment  
nightmare  
.goto('https://www.uat.flygbra.se/ikea')
.wait('#RoundTrip')
// Sida 1 Sök resa
.click('#RoundTrip')
.wait('#allOriginRoutes').insert('#allOriginRoutes', 'STOCKHOLM/BROMMA') // BROMMA/STOCKHOLM  STOCKHOLM/BROMMA Skriver in värdena. De selectas inte
.wait('#destinationRoutesSection').wait(1000).insert('#destinationRoutesSection', 'MALMÖ')
.wait('#MaxPaxTermsSection > label > div').click('#MaxPaxTermsSection > label > div')
//byt datum för återresa för att inte riskera att plocka ut en åtresa som är tididgare än avresan
.click('#TravelTo').wait(2000)
.click('#DatePickerReturn a.ui-datepicker-next').wait(3000)
.click('#DatePickerReturn a.ui-state-default').wait(2000)
.wait('.blue').click('.blue')
// Sida Välj resa
//avresa
.wait('#availability-bound-0 div.bound-table-cell-reco-available').click('#availability-bound-0 div.bound-table-cell-reco-available')
//returresa
.click('#availability-bound-1 div.bound-table-cell-reco-available')
.wait('.tripsummary-price-total').click('button.tripSummary-btn-continue')
// // Sida 3 Resenärsinformation
.wait('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_TitleCode')
.select('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_TitleCode','MR')
.wait('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_FirstName').insert('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_FirstName','Tomas')
.wait('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_LastName').insert('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_LastName','Hesse')
.wait('#tpl3_widget-input-travellerList-contactInformation-Email').insert('#tpl3_widget-input-travellerList-contactInformation-Email','stomas.hesse@consad.se')
.wait('#tpl3_widget-input-travellerList-contactInformation-EmailConfirm').insert('#tpl3_widget-input-travellerList-contactInformation-EmailConfirm','stomas.hesse@consad.se')
.wait('#tpl3_widget-input-travellerList-contactInformation-PhoneMobile').insert('#tpl3_widget-input-travellerList-contactInformation-PhoneMobile','733839999').wait(8000)
.click('button.tripSummary-btn-continue').wait(3000)
// //  Sida 4 Tillval
.wait('#service-desc-SC4').wait(3000).click('button.tripSummary-btn-continue') //alternativt 'span.teaserDescription' 


// //  Sida 5 Betalning
// .wait('#tpl4_radio_CC').click('#tpl4_radio_CC')
// .click('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-ccTypesIcons > div:nth-child(4) > label')
// .wait('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-CA-cardNumber')
// .insert('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-CA-cardNumber','4541090000010073')
// .wait('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-CA-securityCode')
// .insert('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-CA-securityCode','123')
// .select('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-CA-ccMonth','7')
// .select('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-CA-ccYear','23')
// .insert('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-CA-nameOnCard','TEXTY')
// .click('#widget-group-purchaseForm-termsConditionsForm-termsAndCondition > div > label')
// .wait(20000)
// .click('button.tripSummary-btn-continue')
 .wait(20000)
.end()
//run the queue of commands specified, followed by logging the HREF
.then(function(result) {
   console.log('Fart 9 Klar');
 console.log(result);
});

