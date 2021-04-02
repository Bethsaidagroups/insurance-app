/* eslint-disable */

/**
 * form and inputs field validators
 */

 /**
  * Validate email address
  * @param {String} str
  * @returns {Boolean}
  */
 export const validateEmail = (str) =>{
    if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(str)){
        return true;
    }
    else{
        return false;
    }
 }

 /**
  * Validate Password
  * @param {String} str
  * @returns {Boolean}
  */
 export const validatePassword = (str) =>{
     if(String(str).length >= 8){
         return true;
     }
     else{
         return false;
     }
 }

 /**
  * Validate search filter
  * @param {Object} filters
  * @returns {Boolean}
  */
 export const isValidFilter = (filters) =>{
     for (const prop in filters) {
         if(filters[prop] !== null){
             return true;
         }
     }
     return false;
 }