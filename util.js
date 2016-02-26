////Extensions

//check item in arrays.
//params : array, object value
//return boolean.
module.exports.inarray = function inarray(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == obj) return true;
    }
}

//check amex
//params : cardtype,currency
//return boolean.
module.exports.checkamex = function checkamex(cardtype,currency){
    if(cardtype=='amex' && currency!='USD')
    {
      console.log('Sorry! Amex can only be using with USD.');
      return false;
    }
    else
    {
      return true;
    }
}
////////////########