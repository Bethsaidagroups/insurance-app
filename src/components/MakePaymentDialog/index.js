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
    TextField
} from '@material-ui/core';
import { WarningRounded as WarningIcon, Done as SuccessIcon} from '@material-ui/icons'
import { orange, red, green } from '@material-ui/core/colors'
import moment from 'moment'
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux'
import withConfirmationDialog from 'src/utils/confirmationDialog'
import { setReservations, setRooms, setRoomBookings} from 'src/actions'
import {makeRequest, handleError} from 'src/utils/axios-helper';
import { withPermission, useRouter } from 'src/utils';
import qs from 'qs'

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

class PlaceOrderDialog extends Component{
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
        }
    }

    handleContinue = event =>{
        this.props.openDialog({
            viewCtrl: "warning",
            title: "Confirm New Drink Order",
            description: "Make sure you have confirmed the details before you proceed from here",
            close: dialog =>{
                if(dialog.viewCtrl == "success"){
                    this.clearFields()
                    this.props.onClose(null)
                }
                dialog.close()
            },
            confirm: dialog =>{
                let date = new Date();
                makeRequest(this.props).post('/bar/drink/order',qs.stringify({
                    id: this.props.drink.id,
                    reference: this.state.customer.reference,
                    quantity: this.state.quantity,
                    amount: this.state.total_price,
                    order_mode: 'direct'
                }))
                .then(response => {
                    dialog.setViewCtrl("success")
                    dialog.setTitle("Food Ordered!")
                    dialog.setDescription(
                        <Typography>
                            Drink Order Placed successfully
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
                this.clearFields()
            }
        })
      }

    render(){
        return(
            <Fragment>
                <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>
                        Make Payment For This Order
                    </DialogTitle>
                    <Divider style={{marginTop:5,marginBottom:10}}/>
                {this.props.data &&
                    <DialogContent className={this.props.classes.dialogContent}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Customer's Reference"
                                    name="reference"
                                    disabled
                                    value={this.props.data.reference}

                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Drink Name"
                                    value={this.props.drink.name}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Quantity"
                                    name="quantity"
                                    value={this.state.quantity}
                                    helperText={this.state.total_price ? 'Total Price: #'+this.state.total_price.toLocaleString() : ""}
                                    onChange={this.onChange}
                                />
                            </Grid>
                        </Grid>
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
                            disabled={!(this.state.customer && this.state.quantity)}
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
    session_token: state.session_token,
  })
export default connect(mapStateToProps)(withSnackbar(withStyles(useStyles)(withConfirmationDialog(PlaceOrderDialog))));