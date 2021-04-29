"use strict";

// Only export where a Node/Browerserify-esque environment is present
if(typeof exports !== 'undefined'){
  exports.validate = validate;
}

// Only attach to `window` if it's present
if(typeof window !== 'undefined'){
  window.nhsNumberValidator = {validate: validate};
}

/**
 * Validate an NHS number
 * @param {Number,  String} nhsNumber The NHS number to validate. This may be a String or a number.
 * @returns {"valid":{Boolean},"error":{message}} `true` IFF the NHS number validates, else `false`
 **/
function validate(nhsNumber){

  var errormessages = {
    // These are the defaults.
    empty: "empty",
    nan: "numbers only",
    length:"wrong length",
    lenshort:"too short should be 10 characters",
    lengLong:"too long should be 10 characters",
    checkdigit: "checkdigit"
};

  // pre-flight checks
 /* if(
    nhsNumber === undefined ||
    nhsNumber === null ||
    isNaN(Number(nhsNumber)) ||
    nhsNumber.toString().length !== 10
  ){
    return false;
  }*/
  //checkif empty
  if (nhsNumber === undefined || nhsNumber === null || nhsNumber === ""){
    return {valid:false, error:errormessages.empty};
    }
  
  //make sure no spaces
  nhsNumber = nhsNumber.replace(/\s+/g, '');
  //check if not a number  
  if(isNaN(Number(nhsNumber))){
    return {valid:false, error:errormessages.nan};
    }
// check if short
  if(nhsNumber.toString().length < 10){
      return {valid:false, error:errormessages.lenshort};
     }  
// check if long
  if(nhsNumber.toString().length > 10){
      return {valid:false, error:errormessages.lenlong};
    }  

  //check length 
  if(nhsNumber.toString().length !== 10){
     return {valid:false, error:errormessages.length};
    }  

  // convert numbers to strings, for internal consistency
  if(Number.isInteger(nhsNumber)){
    nhsNumber = nhsNumber.toString();
  }

  // Step 1: Multiply each of the first 9 numbers by (11 - position indexed from 1)
  // Step 2: Add the results together
  // Step 3: Divide the total by 11 to get the remainder
  var nhsNumberAsArray = nhsNumber.split('');
  var remainder = nhsNumberAsArray.slice(0,9)
                            .map(multiplyByPosition)
                            .reduce(addTogether, 0) % 11;

  var checkDigit = 11 - remainder;

  // replace 11 for 0
  if(checkDigit === 11){
    checkDigit = 0;
  }

  var providedCheckDigit = nhsNumberAsArray[9];

  // Do the check digits match?
  if(checkDigit === Number(providedCheckDigit)){
    return {valid:true} ;
  }else{
    return {valid:false,error:errormessages.checkdigit} ;
  }
}

/**
 * Multiply a value by its position, using the NHS number strategy
 * @param {Number} digit the single-digit portion of the number
 * @param {Number} index The 0-indexed position of `digit` within the NHS number
 * @returns {Number} the result of the 'multiply by (11-position)' calculation
 **/
function multiplyByPosition(digit, index) {
  // multiple each digit by 11  minus its position (indexed from 1)
  return digit * (11 - (index+1));
}

/**
 * Add two values together. Useful for use in `reduce` calls
 * @param {Number} previousValue the initial value
 * @param {Number} currentValue the value to add to the initial value
 * @returns {Number} the sum of the two parameters
 **/
function addTogether(previousValue, currentValue){
  return previousValue + currentValue;
}
