var Nightmare = require('nightmare'),

  nightmare = Nightmare({
    show: true,
    height: 1080,   //window.height
    width: 1920,
    
  });

 var today = new Date();
 var dd = today.getDate();
 var mm = today.getMonth()+1; //January is 0!
 var yyyy = today.getFullYear() - 5;

// Sida1 ok
nightmare
   .goto('http://www.uat.flygbra.se')
  .wait(3000)
  .click('#OneWayTrip')
  .wait('#allOriginRoutes').insert('#allOriginRoutes', 'BROMMA/STOCKHOLM') // BROMMA/STOCKHOLM  STOCKHOLM/BROMMA Skriver in värdena. De selectas inte
  
  .wait('#destinationRoutesSection').insert('#destinationRoutesSection', 'MALMÖ')
  .click('#passengers').wait('#Children-Add').click('#Children-Add')
  .wait('.blue').click('.blue').wait(5000)
  .end()
  //run the queue of commands specified, followed by logging the HREF
  .then(function(result) {
      console.log('Sida1 Klar');
    console.log(result);
  });
 
  
//  //sida 3, ResenärsInfo 
//   nightmare  
//  .goto('http://localhost:8082/braResenarHtmlMock.html')
//  .select('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_TitleCode','MR')
//   .wait('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_FirstName').insert('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_FirstName','Åke')
//   .wait('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_LastName').insert('#tpl3_widget-input-travellerList-traveller_0_ADT-IDEN_LastName','Börjesson')
//   .select('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_TitleCode','MS')
//   .wait('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_FirstName').insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_FirstName','Märit')
//   .wait('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_LastName').insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_LastName','Österåkersson')
//   .wait('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateDay').insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateDay',dd)
//   .select('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateMonth','5')
//   .wait('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateYear').insert('#tpl3_widget-input-travellerList-traveller_1_CHD-IDEN_DateOfBirth-DateYear',yyyy)
//   .wait('#tpl3_widget-input-travellerList-contactInformation-Email').insert('#tpl3_widget-input-travellerList-contactInformation-Email','tomas.hesse@consid.se')
//   .wait('#tpl3_widget-input-travellerList-contactInformation-EmailConfirm').insert('#tpl3_widget-input-travellerList-contactInformation-EmailConfirm','tomas.hesse@consid.se')
//   .wait('#tpl3_widget-input-travellerList-contactInformation-PhoneMobile').insert('#tpl3_widget-input-travellerList-contactInformation-PhoneMobile','733835979')
//   //.click('button.tripSummary-btn-continue') //#w31 funkar??
//   .click('#w31').wait(8000)
//   //Sida 4,dvs Tillvalssidan, som man bara klickar förbi
//  // .wait('#service-desc-SC4').click('button.tripSummary-btn-continue') //alternativt 'span.teaserDescription' 
  
//   .end()
//   //run the queue of commands specified, followed by logging the HREF
//   .then(function(result) {
//       console.log('Sida 3 Klar');
//     console.log(result);
//   });

//   nightmare  
//     .goto('http://localhost:8082/paymentMock.html')
//     .click('#tpl4_radio_CC')
//     .click('#tpl4_fopTemplate_widget-input-purchaseForm-paymentForm-ccTypesIcons > div:nth-child(2) > label')
//     .wait(3000)
//     .end()
//    //run the queue of commands specified, followed by logging the HREF
//    .then(function(result) {
//        console.log('Sida 3 Klar');
//      console.log(result);
//    });
 

