/* eslint-disable */

import {
   SET_SESSION_USER,
   SET_SESSION_TOKEN,
   SET_USER_PERMISSIONS,
   SET_SELECTED_USER
} from '../actions/types';

 const initialState = {

    session_token: localStorage.getItem("token"), //stores Token

    options: localStorage.getItem("options"), //stores general option, initialize from local storage

    user_permissions: [], //stores user permission

    selected_user: null, //Selected User
    
    user: null, //stores user

    selected_value: null, //Stores global selected value for edit views

 }

 /**
  * function init app reducer function
  */
 const App  = function initApp(state = initialState, action){
     switch (action.type) {
         case SET_SESSION_TOKEN:
            //save the new signed in user
            localStorage.setItem("token", action.token);
            return Object.assign({}, state, {
               session_token: action.token
            });
         
         case SET_SESSION_USER:
             //save the new signed in user
             return Object.assign({}, state, {
                user: action.user
             });

         case SET_USER_PERMISSIONS:
               return Object.assign({}, state, {
                  user_permissions: action.permissions
               });

         case SET_SELECTED_USER:
               return Object.assign({}, state, {
                  selected_user: action.user
               });

         case SET_USER_PERMISSIONS:
               return Object.assign({}, state, {
                  selected_user: action.user
               });
         
         default:
             return state;
     }
 }

 //export app reducer
export default App;
