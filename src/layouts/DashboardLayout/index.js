/* eslint-disable */
import React from 'react';
import { Outlet } from 'react-router-dom';
import { createStyles } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { setPendingDrinkOrderCount, setPendingFoodOrderCount, setSessionUser, setUserPermissions } from 'src/actions'
import { useRouter, withPermission } from 'src/utils'
import {makeRequest, handleError} from 'src/utils/axios-helper'
import { withSnackbar } from 'notistack'
import DrinkOrderAlert from './DrinkOrderAlert';
import FoodOrderAlert from './FoodOrderAlert';

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

class DashboardLayout extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      mobileNaveOpen: false,
      openDrinkAlert: false,
      openFoodAlert: false,
    }
  }

  componentDidMount(){
    //check if token is valid
    makeRequest(this.props).get('/auth/validate')
    .then(response => {
      this.props.dispatch(setSessionUser(response.data.data.user))
      //this.props.dispatch(setUserPermissions(response.data.permissions))
    })
    .catch(error => {
        handleError({
            error: error,
            callbacks: {
              400: response=>{
                this.props.enqueueSnackbar('Invalid or expired session token', {variant: "error"});
                this.props.navigate('/login')
              },
              401: response=>{
                this.props.enqueueSnackbar('Invalid or expired session token', {variant: "error"});
                this.props.navigate('/login')
              },
              403: response=>{
                this.props.enqueueSnackbar('Invalid or expired session token', {variant: "error"});
                this.props.navigate('/login')
              },
              500: response=>{
                this.props.enqueueSnackbar('Could not verify session token from server', {variant: "error"});
                this.props.navigate('/login')
              },
            }
        }, this.props);
    })
    .finally(() => {
        //do nothing
        this.setState({windowIsLoading:false});
    })
  }

  hasPermission = (user_permissions, permission_name) =>{
    let has_permission = false;
            //Check if permission_name is an array
                if(user_permissions != null){
                    for (let index = 0; index < user_permissions.length; index++) {
                        const permission = user_permissions[index].permission;
                        if(permission.name == permission_name){
                            has_permission = true;
                            break;
                        }
                    }
                }
            return has_permission
 }

  render(){
    return (
      <div className={this.props.classes.root}>
        <DrinkOrderAlert open={this.state.openDrinkAlert} onClose={e=>this.setState({openDrinkAlert:false})} />
        <FoodOrderAlert open={this.state.openFoodAlert} onClose={e=>this.setState({openFoodAlert:false})} />
        <TopBar onMobileNavOpen={() => this.setState({mobileNaveOpen:true})} />
        <NavBar
          onMobileClose={() => this.setState({mobileNaveOpen:false})}
          openMobile={this.state.mobileNaveOpen}
        />
        <div className={this.props.classes.wrapper}>
          <div className={this.props.classes.contentContainer}>
            <div className={this.props.classes.content}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = state =>({
  session_token: state.session_token,
  pending_drink_order_count: state.pending_drink_order_count,
  pending_food_order_count: state.pending_food_order_count
})

export default connect(mapStateToProps)(
  withStyles(useStyles)(
    withSnackbar(
      useRouter(DashboardLayout))));
