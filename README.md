# paypal-braintree-nodejs-test

This is a repo for Paypal/Braintree NodeJS Sandbox Test.

1. Please run $ node app.js in terminal.
2. Please open qunit_test.html in the browser to run the test.

Thank you!!

How would you handle security for saving credit cards?

Based on the articles I have read recently. It is a huge risk saving credit cards information in our database.

But, still, we can encrypt the card information followng PCI Guidelines and alternatively we can use the third-party services like
Google Checkout, Amazon Payments, Authorize.net,. etc. to keep the card information.

References :
http://security.stackexchange.com/questions/10958/credit-card-storage-hashes-truncation-encrypted-data
http://stackoverflow.com/questions/13718862/store-credit-card-detail-into-mysql-database?lq=1
http://stackoverflow.com/questions/3328922/saving-credit-card-information-in-mysql-database
https://www.pcisecuritystandards.org/index.php