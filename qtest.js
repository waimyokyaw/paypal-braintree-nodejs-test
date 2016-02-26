asyncTest('Page Loading', function(){
	expect(1); // we have one async test to run
	
	var xhr = $.ajax({
		type: 'GET',
		url: 	'http://localhost:8000/'
	})
	.always(function(data, status){
		console.log(status);
		equal(status, 'success', 'Page Loaded');
		start(); 
	});
});

asyncTest('Amex and USD Test', function(){
	expect(1); // we have one async test to run
	var parameters = { name: "TEST A", card_number: "4032032634220690", expiry_month: "01", expiry_year: "2017", cvv: "212", cardtype: "amex", currency: "THB", amount: "1000" };
	var xhr = $.ajax({
		type: 'POST',
		url: 	'http://localhost:8000/checkout',
		data: parameters
	})
	.always(function(data, status){
		console.log(data);
		equal(data, 'Sorry! Amex can only be using with USD.', 'Amex and USD Checked!');
		start(); 
	});
});

asyncTest('Braintree Test', function(){
	expect(1); // we have one async test to run
	var parameters = { name: "TEST B", card_number: "4032032634220690", expiry_month: "01", expiry_year: "2017", cvv: "212", cardtype: "visa", currency: "HKD", amount: "10000" };
	var xhr = $.ajax({
		type: 'POST',
		url: 	'http://localhost:8000/checkout',
		data: parameters
	})
	.always(function(data, status){
		console.log(data);
		equal(status, 'success', 'Braintree Checked!');
		start(); 
	});
});

asyncTest('Paypal Test', function(){
	expect(1); // we have one async test to run
	var parameters = { name: "TEST C", card_number: "4032032634220690", expiry_month: "01", expiry_year: "2017", cvv: "212", cardtype: "visa", currency: "AUD", amount: "10000" };
	var xhr = $.ajax({
		type: 'POST',
		url: 	'http://localhost:8000/checkout',
		data: parameters
	})
	.always(function(data, status){
		console.log(data);
		equal(status, 'success', 'Paypal Checked!');
		start(); 
	});
});