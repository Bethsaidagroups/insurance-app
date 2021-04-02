/* eslint-disable  */
import React, { Component, Fragment } from 'react';

import { 
  Typography, 
  Grid, 
  Checkbox, 
  FormControlLabel, 
  Card, 
  CardHeader, 
  createStyles, 
  withStyles,
  TextField,
  MenuItem,
  Paper, 
  Divider,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Container
} from '@material-ui/core';
import { SettingsApplications as AdminIcon, BarChart as ManagementIcon, Dashboard as BasicIcon } from '@material-ui/icons';
import { makeRequest, handleError} from 'src/utils/axios-helper';
import ContainerWithLoader from 'src/components/ContainerWithLoader'
import qs from 'qs';
import {withSnackbar} from 'notistack';
import { connect } from 'react-redux';
import withPermission from 'src/utils/permission'
import { blue, blueGrey } from '@material-ui/core/colors';
import { Skeleton } from '@material-ui/lab';
import {useRouter} from 'src/utils'

const VIEW_PERMISSION_NAME = "can_edit_staff_permission";

const useStyles = createStyles(theme => ({
 cardRoot:{
  
 },
 gridRoot:{
   marginTop: 10, 
 },
 paperRoot: {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: 400,
},
 formControlLabel:{
   fontSize: 12
 },
 permissionSubHead:{
   fontSize: 17,
   color: blueGrey[500]
 },
 cardActions:{
   justifyContent: "right"
 },
 officeLocationCard:{
   [theme.breakpoints.up("md")]:{
     maxHeight: 250
   }
 }
}))

class StaffPermission extends Component{

  constructor(props){
    super(props)
    this.state = {
      isLoading: true,
      permissions: {
        admin: [],
        management: [],
        basic: [],
      },
      staffs: [],
      staff_office_location: [],
      isLoadingStaffOffice: false,
      selectedStaff: this.props.selectedStaff,
      saveIsLoading: false,
      officeLocationSaveIsLoading: false
    }
  }

  componentDidMount(){
    if(!this.props.selectedStaff){
      window.location = "/app/staff"
    }
    makeRequest(this.props).get(this.props.selectedStaff ? '/staff/permission/'+this.props.selectedStaff.id : '/staff/permission')
        .then(response => {
           this.setState({
             permissions:response.data.data,
             staffs:response.data.data.staffs,
             isLoading:false
            })
        })
        .catch(error => {
            handleError({
                error: error,
                callbacks: {
                400: response=>{ this.props.enqueueSnackbar(response.data.message, {variant: "error"}); }
                }
            }, this.props);
        })
        .finally(() => {
          //Do nothing
        })
  }

  handleStaffChange = (event) =>{
    this.setState({isLoading:true, isLoadingStaffOffice:true})
    let selectedStaff = null
    for (let index = 0; index < this.state.staffs.length; index++) {
      if(this.state.staffs[index].id == event.target.value){
        selectedStaff = this.state.staffs[index];
        break;
      }
    }
    this.resetStaffOfficeLocation(event.target.value)
    
    makeRequest(this.props).get('/staff/permission/'+event.target.value)
        .then(response => {
           this.setState({
             permissions:response.data.data,
             selectedStaff:selectedStaff,
             isLoading:false
            })
        })
        .catch(error => {
            handleError({
                error: error,
                callbacks: {
                400: response=>{ this.props.enqueueSnackbar(response.data.message, {variant: "error"}); }
                }
            }, this.props);
        })
        .finally(() => {
          //Do nothing
        })
      event.preventDefault()
  }

  isChecked = (location) =>{
    if(this.state.staff_office_location){
      for (let index = 0; index < this.state.staff_office_location.length; index++) {
        if(location.id == this.state.staff_office_location[index].id){
          return true
        }
      }
      return false
    }
    else{
      return false
    }
  }


  handlePermissionCheck = (category,index,current_state) =>{
    if(this.state.selectedStaff){
      let updated_permission = this.state.permissions[category];
      updated_permission[index].is_assigned = !current_state;
      this.setState({form_input: Object.assign({},
        this.state.permissions,
        {[category]: updated_permission}
      )})
    }
    else{
      this.props.enqueueSnackbar("No staff selected!", {variant: "default"});
    }
  }

  handleSavePermission = event => {
    this.setState({saveIsLoading: true})
    //Serialize Permissions
    let permissions_list = []
    for (const category in this.state.permissions) {
      for (let index = 0; index < this.state.permissions[category].length; index++) {
       permissions_list.push({
         id: this.state.permissions[category][index].id,
         name: this.state.permissions[category][index].name,
         is_assigned: this.state.permissions[category][index].is_assigned
       })
        
      }
    }
    makeRequest(this.props).post('/staff/permission/save/'+this.state.selectedStaff.id, qs.stringify({permissions: permissions_list}))
        .then(response => {
          this.props.enqueueSnackbar(response.data.message, {variant: "success"});
        })
        .catch(error => {
            handleError({
                error: error,
                callbacks: {
                400: response=>{ this.props.enqueueSnackbar(response.data.message, {variant: "error"}); }
                }
            }, this.props);
        })
        .finally(() => {
          //Do nothing
          this.setState({saveIsLoading: false})
        })
  }

  render(){
    return(
      <Container maxWidth={false} style={{marginTop: 30}}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
              <Card >
                <CardHeader 
                  title={this.state.selectedStaff ? this.state.selectedStaff.first_name + " " + this.state.selectedStaff.last_name : "No Staff Selected"}
                  subheader="Staff Permissions"
                />
                <Divider style={{marginBottom:15}}/>

                  {this.state.isLoading ? (
                      <Skeleton variant="rect" width="100%" height="60vh" />
                  ) : (
                    <CardContent>
                      <Typography className={this.props.classes.permissionSubHead}><BasicIcon/> Basic Permissions</Typography>
                      <Grid container spacing={1}>
                            {
                              this.state.permissions.basic.map((permission, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={this.props.classes.gridRoot}>
                                  <FormControlLabel
                                    className={this.props.classes.formControlLabel}
                                    control={
                                    <Checkbox 
                                      name={permission.name} 
                                      checked={permission.is_assigned}
                                      onChange={evt => this.handlePermissionCheck('basic',index, permission.is_assigned)}
                                    />
                                    }
                                    label={permission.display_name}
                                  />
                                </Grid>
                              ))
                            }
                      </Grid>
        
                      <Divider style={{marginBottom:10,marginTop:10}}/>
        
                      <Typography className={this.props.classes.permissionSubHead}><ManagementIcon/> Management Permissions</Typography>
                      <Grid container spacing={1}>
                            {
                              this.state.permissions.management.map((permission, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={this.props.classes.gridRoot}>
                                  <FormControlLabel
                                    className={this.props.classes.formControlLabel}
                                    control={
                                    <Checkbox 
                                      name={permission.name} 
                                      checked={permission.is_assigned}
                                      onChange={evt => this.handlePermissionCheck('management',index, permission.is_assigned)}
                                    />
                                    }
                                    label={permission.display_name}
                                  />
                                </Grid>
                              ))
                            }
                      </Grid>
        
                      <Divider style={{marginBottom:10,marginTop:10}}/>
                      
                      <Typography className={this.props.classes.permissionSubHead}><AdminIcon/> Administrative Permissions</Typography>
                      <Grid container spacing={1}>
                            {
                              this.state.permissions.admin.map((permission, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4} className={this.props.classes.gridRoot}>
                                  <FormControlLabel
                                    className={this.props.classes.formControlLabel}
                                    control={
                                    <Checkbox 
                                      name={permission.name} 
                                      checked={permission.is_assigned}
                                      onChange={evt => this.handlePermissionCheck('admin',index, permission.is_assigned)}
                                    />
                                    }
                                    label={permission.display_name}
                                  />
                                </Grid>
                              ))
                            }
                      </Grid>
                    </CardContent>
                  )}

                <Divider style={{marginBottom:10,marginTop:10}}/>
                <CardActions className={this.props.classes.cardActions}>
                  <ContainerWithLoader component="span" isLoading={this.state.saveIsLoading}>
                    <Button 
                      variant="contained"
                      disableElevation
                      color="primary"
                      disabled={!this.state.selectedStaff}
                      onClick={this.handleSavePermission}
                    >
                      Save
                    </Button>
                  </ContainerWithLoader>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
          
      </Container>
    )
  }
}

//Map state to props
const mapStateToProps = state => ({
    session_token: state.session_token,
    user_permissions: state.user_permissions,
    selectedStaff: state.selected_user
  });
  
export default connect(mapStateToProps)(
  withSnackbar(
    withPermission(VIEW_PERMISSION_NAME)(withStyles(useStyles)(useRouter(StaffPermission)))))