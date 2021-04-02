/**
 * App action creators
 */
import {
   SET_SESSION_USER,
   SET_SESSION_TOKEN,
   SET_USER_PERMISSIONS,
   SET_SELECTED_USER
} from './types';

 /**
  * Set user
  * @param {Object} user
  */
 export function setSessionUser(user){
   return {
      type: SET_SESSION_USER,
      user
   }
}

 /**
  * Set Token
  * @param {String} user
  */
 export function setSessionToken(token){
   return {
      type: SET_SESSION_TOKEN,
      token
   }
}

 /**
  * Set User Permission
  * @param {Objects} permission
  */
 export function setUserPermissions(permissions){
   return {
      type: SET_USER_PERMISSIONS,
      permissions
   }
}

 /**
  * Set Selected User
  * @param {Objects} user
  */
 export function setSelectedUser(user){
   return {
      type: SET_SELECTED_USER,
      user
   }
}
