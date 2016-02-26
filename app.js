'use strict';

const Hapi = require('hapi');

const paypal = require('paypal-rest-sdk');
const braintree = require('braintree');

const paypalCurrencies = ['USD','EUR','AUD'];

const paypalConfig = require("./paypal.json");
const braintreeConfig = require("./braintree.json");
//configuration

var util = require('./util.js');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000
});

//Make public folder available to access
server.register(require('inert'),(err) => {
  if(err){
    throw err;
  }
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
           path: __dirname + '/public',
        }
    }
});
});

//Serve static card_form.html
server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        config: {
          cors: true, //cors added for unit tests. please remove when goes to production.
        },
        handler: function (request, reply) {
            reply.file('./public/card_form.html');
        }
    });
});

//To send back to client-side
server.route({
    method: 'GET',
    path:'/success', 
    config: {
          cors: true, //cors added for unit tests. please remove when goes to production.
        },
    handler: function (request, reply) {

        return reply('Payment is completed.');
    }
});

server.route({
    method: 'GET',
    path:'/fail', 
    config: {
          cors: true, //cors added for unit tests. please remove when goes to production.
        },
    handler: function (request, reply) {

        return reply('Payment failed.');
    }
});

//Proceed with checkout.
server.route({
    method: ['PUT', 'POST'],
    path: '/checkout',
    config: {
          cors: true, //cors added for unit tests. please remove when goes to production.
    },
    handler: function (request, reply) {
        
        var card_number = request.payload.cus_card_number;
        
        var cardtype = request.payload.cardtype;
        var currency = request.payload.currency;

        if(util.inarray(paypalCurrencies,currency)){
          //check if amex gets correct curreny : usd.
          if(!util.checkamex(cardtype,currency))
          {
            reply('Sorry! Amex can only be using with USD.');
            return false;
          }
          if(GoPaypal(request,reply)){
            return true;
          }
          else
          {
            return false;
          }
        }
        else
        {
          //For Braintree
          //check if amex gets correct curreny : usd.
          if(!util.checkamex(cardtype,currency)){
            reply('Sorry! Amex can only be using with USD.');
            return false;
          }
          console.log('Connect Braintree');
          if(GoBraintree(request,reply)){
            return true;
          }else{
            return false;
          }
        }
    }
});

// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

////Check out methods
//Paypal  
function GoPaypal(req,rep){

      var fullName = req.payload.name.split(' '),
          firstName = fullName[0],
          lastName = fullName[fullName.length - 1];

      paypal.configure(paypalConfig);

      var paymentData = {
          "intent": "sale",
          "payer": {
            "payment_method": "credit_card",
            "funding_instruments": [{
              "credit_card": {
                "number": req.payload.card_number,
                "type": req.payload.cardtype,
                "expire_month": req.payload.expiry_month,
                "expire_year": req.payload.expiry_year,
                "cvv2": req.payload.cvv,
                "first_name": firstName,
                "last_name": lastName
              }
            }]
          },
          "transactions": [{
            "amount": {
              "total": req.payload.amount,
              "currency": req.payload.currency
            },
            "description": "Test Payment"
          }]
          };

      paypal.payment.create(paymentData, function (error, payment) {
        if (error) {
          console.log(error);
          rep.redirect('/fail');
        } else {
          rep.redirect('/success');
        }
      });
}

//Braintree
function GoBraintree(req,rep){

  //load braintree config from braintree.json
  var gateway = braintree.connect({
      environment: braintree.Environment.Sandbox,
      merchantId: braintreeConfig.merchantId,
      publicKey: braintreeConfig.publicKey,
      privateKey: braintreeConfig.privateKey
  });
  
  var paymentMethod = '';
  if(req.payload.cardtype=='visa'){
    paymentMethod = 'fake-valid-visa-nonce';
  }else if(req.payload.cardtype=='master'){
    paymentMethod = 'fake-valid-mastercard-nonce';
  }else if(req.payload.cardtype=='amex'){
    paymentMethod = 'fake-valid-amex-nonce';
  }
  //Proceed if payment method is not ''
  if(paymentMethod!=''){

    gateway.transaction.sale({
            amount: req.payload.amount,
            paymentMethodNonce: paymentMethod,
            options: {
              submitForSettlement: true
            }
    },function(err, result) {
        if(err){
          console.log(err);
          rep.redirect('/fail');
        }else if (result) {
          if (result.success) {
            console.log("Transaction ID: " + result.transaction.id);
            rep.redirect('/success');
          } else {
            console.log(result.message);
            rep.redirect('/fail');
          }
        }
    });

  }else{
    rep.redirect('/fail');
  }
}