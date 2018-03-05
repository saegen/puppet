var Nightmare = require('nightmare'),
  nightmare = Nightmare({
    show: true,
    height: 1080,
    width: 1920
  });

  var last = 'Kvinna'
  var bookref = 'SUHQ73'
  nightmare  
//  .goto('http://localhost:8082/start.html')
.goto('https://www.uat.flygbra.se/')
  .wait('a[href="/visa-andra-bokningar/"]').click('a[href="/visa-andra-bokningar/"]')
  .wait('#SearchBooking_Surname').insert('#SearchBooking_Surname',last)
  .wait('#SearchBooking_BookingReference').insert('#SearchBooking_BookingReference',bookref)
  .click('#searchBookingFormBtn')
  .wait('span[data-action="REFUND"]')
  .screenshot('./hanterabokning.png')
  .click('span[data-action="REFUND"]') //AVBOKA RESA knapp
  .end()
  //run the queue of commands specified, followed by logging the HREF
  .then(function(result) {
    console.log(result);
  });

// nightmare
//   .goto('http://localhost:8082/hanterabokningmock.html')
//   .wait('span[data-action="REFUND"]').click('span[data-action="REFUND"]')
//   .end()
//   //run the queue of commands specified, followed by logging the HREF
//   .then(function(result) {
//     console.log(result);
//   });
