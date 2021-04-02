/* eslint-disable */

/**
 * Axios Helper functions
 */
import Axios from 'axios';
import axiosConfig from '../config/axiosConfig';
//import configureStore from 'config/configureStore';
//import {setIsAuthenticatedStatus} from 'actions';

//const store = configureStore();
/**
 * Axios Object wrapper
 * The init object can conatain a nullable object or have properties: session_token & dispatch
 * @param {object} init
 */
const makeRequest = ({session_token:token = ""} = {session_token:null})=>{
    var axios = Axios.create(axiosConfig);
    if(token){
      axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    }
    return axios;
}

/**
 * An easy to use error handler for axios promises with response status codes other than 200 and 201
 * @param {object} handler
 * @param {function} enqueueSnackbar
 */
const handleError = (handler, {enqueueSnackbar=null,dispatch}=null)=>{

    if (handler.error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if(handler.hasOwnProperty('callbacks')){
            if(handler.callbacks.hasOwnProperty(handler.error.response.status)){
                //call the error callback
                handler.callbacks[parseInt(handler.error.response.status)](handler.error.response);
                return;
            }
            else{
                //No Error callback for this error code returned response object
                if((handler.error.response.status == 401) || (handler.error.response.status == 403)){
                  if(enqueueSnackbar){
                    enqueueSnackbar('Invalid or Expired Session!', {variant: "error"});
                  }
                  else{
                    console.log('Invalid or Expired Session!')
                  }
                  //update application state to reflect new invlaid/expired authentication
                  //dispatch(setIsAuthenticatedStatus(false))
                  window.location = axiosConfig.login_url + "?red_x=401";
                  return;
                }
                else if(handler.error.response.status == 423){
                  if(enqueueSnackbar){
                    enqueueSnackbar('Permission Denied!', {variant: "error"});
                  }
                  else{
                    console.log('Permission Denied!')
                  }
                  return;
                }
                else{
                  if(enqueueSnackbar){
                    enqueueSnackbar('Server returned an error with status code: ' + handler.error.response.status, {variant: "error"});
                  }
                  else{
                    console.log('Server returned an error with status code: ' + handler.error.response.status)
                  }
                  return;
                }
            }
        }
        else{
            //Error callback not set retun response code
            if((handler.error.response.status == 401) || (handler.error.response.status == 403)){
              if(enqueueSnackbar){
                enqueueSnackbar('Invalid or Expired Session!', {variant: "error"});
              }
              else{
                console.log('Invalid or Expired Session!')
              }
              //update application state to reflect new invlaid/expired authentication
              //dispatch(setIsAuthenticatedStatus(false))
              window.location = axiosConfig.login_url + "?red_x=401";
              return;
            }
            else if(handler.error.response.status == 423){
              if(enqueueSnackbar){
                enqueueSnackbar('Permission Denied!', {variant: "error"});
              }
              else{
                console.log('Permission Denied!')
              }
              return;
            }
            else{
              if(enqueueSnackbar){
                enqueueSnackbar('Server returned an error with status code: ' + handler.error.response.status, {variant: "error"});
              }
              else{
                console.log('Server returned an error with status code: ' + handler.error.response.status)
              }
              return;
            }
        }
      } 
      else if (handler.error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        if(handler.hasOwnProperty('callbacks')){
          try {
            handler.callbacks['request'](handler.error);
          } 
          catch (error) {
            if(enqueueSnackbar){
              enqueueSnackbar('Connection to server lost', {variant: "default"});
            }
            else{
              console.log('Connection to server lost')
            }
            return;
          }
        }
        else{
            console.log("Request was made but no response was received");
            window.location = axiosConfig.login_url + "?red_x=501";
            return;
        }
      } 
      else {
        // Something happened in setting up the request that triggered an Error
        if(handler.hasOwnProperty('callbacks')){
          try {
            handler.callbacks['default'](handler.error);
          } catch (error) {
            if(enqueueSnackbar){
              enqueueSnackbar('Connection to server lost', {variant: "default"});
            }
            else{
              console.log('Connection to server lost')
            }
          }
        }
        else{
          if(enqueueSnackbar){
            enqueueSnackbar(handler.error.message, {variant: "error"});
          }
          else{
            console.log(handler.error.message)
          }
        }
      }
}

export {makeRequest, handleError};