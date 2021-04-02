/* eslint-disable */
import React, { Component, Fragment } from 'react';
import {
    Box, 
    Button, 
    Avatar, 
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    createStyles, 
    withStyles,
    Typography,
    CircularProgress,
    Grid,
    Divider,
    TextField,
    MenuItem
} from '@material-ui/core';
import { WarningRounded as WarningIcon, Done as SuccessIcon} from '@material-ui/icons'
import { orange, red, green } from '@material-ui/core/colors'
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux'
import withConfirmationDialog from 'src/utils/confirmationDialog'
import {makeRequest, handleError} from 'src/utils/axios-helper';
import qs from 'qs';

const useStyles = createStyles(theme => ({
    dialogContent: {
        minHeight: 300
    },
    avatarBox:{
        display: "flex",
        flexDirection:  "column",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        width: 80,
        height: 80,
        backgroundColor: green[500]
    },
    topHeader:{
        fontSize: 17,
        color: "#333333",
        fontWeight: 500,
    },
    title: {
        fontSize: 15,
        color: "#222222",
        fontWeight: 500,
    },
    text: {
        fontSize: 13,
        color: "#555555",
        marginTop: 5,
        marginBottom: 15,
        textTransform: "Capitalize"
    },
    balanceText: {
        fontSize: 14,
        color: green[600],
        fontWeight: 600,
        marginTop: 5,
        marginBottom: 15
    },
    lastInfo: {
        fontSize: 13,
        color: "#555555",
        marginTop: 20,
    },
    buttonCancel:{
        color: red[500]
    }
}))

class EditStaffDialog extends Component{
    constructor(props){
        super(props)
        this.state = {
            username: "",
            first_name: "",
            last_name: "",
            gender: "",
            email: "",
            position: "",
            password: "",
            password_verify: ""
          }
    }

    onChange = event =>{
        if(event.target.name == "reference"){
            let customer = ""
            this.props.reservations.forEach(row => {
                if(event.target.value == row.reference){
                    customer = row
                }
            });
            this.setState({
                reference: event.target.value,
                name: customer ? `${customer.first_name} ${customer.last_name}: Balance-(#${customer.balance.toLocaleString()})` : ""
            })
            this.setState({customer: customer})
        }
        else if(event.target.name == "quantity"){
            this.setState({quantity: event.target.value})
            if((parseInt(event.target.value) * this.props.food.price)){
                this.setState({
                    total_price: (parseInt(event.target.value) * this.props.food.price)
                })
            }
            else{
                this.setState({
                    total_price: ""
                })
            }
        }
    }

    handleContinue = event =>{
        
            this.props.openDialog({
                viewCtrl: "warning",
                title: "Confirm Staff Updated",
                description: "Make sure you have confirmed the details before you proceed from here",
                close: dialog =>{
                    dialog.close()
                },
                confirm: dialog =>{
                    makeRequest(this.props).post('/admin/update',qs.stringify({
                        id: this.props.staff.id,
                        username: this.props.staff.username,
                        first_name: this.state.first_name ? this.state.first_name : this.props.staff.first_name,
                        last_name: this.state.last_name ? this.state.last_name : this.props.staff.last_name,
                        email: this.state.email ? this.state.email : this.props.staff.email,
                        gender: this.state.gender ? this.state.gender : this.props.staff.gender,
                        position: this.state.position ? this.state.position : this.props.staff.position,
                    }))
                        .then(response => {
                            dialog.setViewCtrl("success")
                            dialog.setTitle("Staff Details Updated!")
                            dialog.setDescription(
                                <Typography>
                                    Staff Account Updated successfully
                                </Typography>
                            )
                            this.props.updateRow({
                                id: this.props.staff.id,
                                username: this.props.staff.username,
                                avatar: this.props.staff.avatar,
                                first_name: this.state.first_name ? this.state.first_name : this.props.staff.first_name,
                                last_name: this.state.last_name ? this.state.last_name : this.props.staff.last_name,
                                email: this.state.email ? this.state.email : this.props.staff.email,
                                gender: this.state.gender ? this.state.gender : this.props.staff.gender,
                                position: this.state.position ? this.state.position : this.props.staff.position,
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
            })
      }

      handleUpdate = event =>{
        if(this.state.password && this.state.password_verify){
            
                this.props.openDialog({
                    viewCtrl: "warning",
                    title: "Confirm Password Change",
                    description: "Make sure you have confirmed the details before you proceed from here",
                    close: dialog =>{
                        if(dialog.viewCtrl == "success"){
                            this.setState({password: "", password_verify: ""})
                        }
                        dialog.close()
                    },
                    confirm: dialog =>{
                        makeRequest(this.props).post('/admin/update-pwd',qs.stringify({
                            id:this.props.staff.id,
                            password: this.state.password,
                            password_verify: this.state.password_verify
                        }))
                            .then(response => {
                                dialog.setViewCtrl("success")
                                dialog.setTitle("Success!")
                                dialog.setDescription(
                                    <Typography>
                                        Password Changed successfully
                                    </Typography>
                                )
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
                })
        }
        else{
            this.props.enqueueSnackbar("Invalid Field Entries", {variant:'error'});
        }
      }

    clearFields = () =>{
        this.setState({
            email: "",
            first_name: "",
            last_name: "",
            gender: "",
            email: "",
            position: "",
          })
    }

    render(){
        return(
            <Fragment>
                <Dialog
                    fullWidth
                    maxWidth="lg"
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>
                        Edit Staff Details
                    </DialogTitle>
                    <Divider style={{marginTop:5,marginBottom:10}}/>
                {this.props.staff &&
                    <DialogContent className={this.props.classes.dialogContent}>
                        <Grid container spacing={2} style={{marginTop: 20}}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Username"
                                    name="username"
                                    value={this.props.staff.username}
                                    onChange={e => this.setState({username:e.target.value})}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="First Name"
                                    name="first_name"
                                    value={this.state.first_name ? this.state.first_name : this.props.staff.first_name}
                                    onChange={e => this.setState({first_name:e.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Last Name"
                                    name="last_name"
                                    value={this.state.last_name ? this.state.last_name : this.props.staff.last_name}
                                    onChange={e => this.setState({last_name:e.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Gender"
                                    name="gender"
                                    value={this.state.gender ? this.state.gender : this.props.staff.gender}
                                    onChange={e => this.setState({gender:e.target.value})}
                                    select
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Phone Number"
                                    name="email"
                                    value={this.state.email ? this.state.email : this.props.staff.email}
                                    onChange={e => this.setState({email:e.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Position"
                                    name="position"
                                    value={this.state.position ? this.state.position : this.props.staff.position}
                                    onChange={e => this.setState({position:e.target.value})}
                                    select
                                >
                                    <MenuItem value="Administrator">Administrator</MenuItem>
                                    <MenuItem value="Account Officer">Acount Officer</MenuItem>
                                    <MenuItem value="General Manager">General Manager</MenuItem>
                                    <MenuItem value="Under Writer">Underwitter</MenuItem>
                                    <MenuItem value="Marketer">Marketer/Agent</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Divider style={{marginTop: 35, marginBottom: 15}}/>
                        <Typography>Change User's Password</Typography>
                        <Grid container spacing={2} style={{marginTop: 20}}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Password"
                                    name="password"
                                    value={this.state.password}
                                    type="password"
                                    onChange={e => this.setState({password:e.target.value})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Verify Password"
                                    name="password_verify"
                                    value={this.state.password_verify}
                                    type="password"
                                    onChange={e => this.setState({password_verify:e.target.value})}
                                />
                            </Grid>
                        </Grid>
                        <Button 
                            style={{marginTop: 20}}
                            disableElevation 
                            variant="contained" 
                            color="primary" 
                            onClick={this.handleUpdate}
                            disabled={ ((this.state.password.length < 6) || (this.state.password !== this.state.password_verify))}
                            >
                                Change Password
                        </Button>
                    </DialogContent>
                }
                    <Divider style={{marginTop:15,marginBottom:5}}/>
                    <DialogActions>
                        <Button  
                            className={this.props.classes.buttonCancel} 
                            onClick={this.props.onClose}
                            variant="outlined"
                            disableElevation
                        >
                            Cancel
                        </Button>
                        <Button  
                            style={{marginLeft:10}}
                            onClick={this.handleContinue}
                            variant="contained"
                            color="primary"
                            disableElevation
                        >
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}
  

const mapStateToProps = (state) => ({
    session_token: state.session_token
  })
export default connect(mapStateToProps)(withSnackbar(withStyles(useStyles)(withConfirmationDialog(EditStaffDialog))));