/* eslint-disable */
import React, { Component, Fragment } from 'react';
import {
    Box, 
    Button, 
    Avatar, 
    Dialog,
    DialogContent,
    DialogActions,
    createStyles, 
    withStyles,
    Typography,
    CircularProgress
} from '@material-ui/core';
import { WarningRounded as WarningIcon, Done as SuccessIcon} from '@material-ui/icons'
import { orange, red, green } from '@material-ui/core/colors'

const useStyles = createStyles(theme => ({
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300
    },
    avatarWarning: {
        width: 80,
        height: 80,
        marginBottom: 20,
        backgroundColor: orange[300]
    },
    avatarSuccess: {
        width: 80,
        height: 80,
        marginBottom: 20,
        backgroundColor: green[400]
    },
    warningIcon:{
        fontSize: 40,
        color: "#fff"
    },
    title: {
        fontSize: 17,
        color: "#333333",
        fontWeight: 500,
        textAlign: "center"
    },
    description: {
        fontSize: 13,
        color: "#555555",
        marginTop: 10,
        textAlign: "center"
    },
    buttonContinue:{
        marginTop: 15
    },
    buttonCancel:{
        color: red[500],
        borderColor: red[500],
    }
}))

class ConfirmationDialog extends Component{
    constructor(props){
        super(props)
    }

    handleContinue = (event) => {
        if(this.props.onConfirm){
            this.props.onConfirm()
        }
    }

    render(){
        return(
            <Fragment>
                {
                    ((this.props.viewCtrl == "success") || (this.props.viewCtrl == "warning") || (this.props.viewCtrl == "loading")) &&
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={true}
                        onClose={this.props.onClose}
                    >
                        {
                            this.props.viewCtrl == "loading" ? (
                                <DialogContent className={this.props.classes.dialogContent}>
                                    <CircularProgress size={35}/>
                                    <Typography className={this.props.classes.description} component="p">Processing</Typography>
                                </DialogContent>
                            ) : (
                                <div>
                                    {
                                        this.props.viewCtrl == "warning" ? (
                                            <DialogContent className={this.props.classes.dialogContent}>
                                                <Avatar className={this.props.classes.avatarWarning}>
                                                    <WarningIcon className={this.props.classes.warningIcon}/>
                                                </Avatar>
                                                <Typography 
                                                    className={this.props.classes.title} 
                                                    component="h5"
                                                    >
                                                        {this.props.title ? this.props.title : "Confirm Action!"}
                                                    </Typography>
                                                <Typography 
                                                    className={this.props.classes.description} 
                                                    component="p"
                                                >
                                                    {this.props.description}
                                                </Typography>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    disableElevation 
                                                    className={this.props.classes.buttonContinue}
                                                    onClick={this.handleContinue}
                                                >
                                                    {this.props.confirmButtonText ? this.props.confirmButtonText : "Continue"}
                                                </Button>
                                            </DialogContent>
                                        ) : (null)
                                    }
                                    {
                                        this.props.viewCtrl == "success" ? (
                                            <DialogContent className={this.props.classes.dialogContent}>
                                                <Avatar className={this.props.classes.avatarSuccess}>
                                                    <SuccessIcon className={this.props.classes.warningIcon}/>
                                                </Avatar>
                                                <Typography 
                                                    className={this.props.classes.title} 
                                                    component="h5"
                                                    >
                                                        {this.props.title ? this.props.title : "Successful!"}
                                                    </Typography>
                                                <Typography 
                                                    className={this.props.classes.description} 
                                                    component="p"
                                                >
                                                    {this.props.description}
                                                </Typography>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    disableElevation 
                                                    className={this.props.classes.buttonContinue}
                                                    onClick={this.props.onClose}
                                                >
                                                    Ok
                                                </Button>
                                            </DialogContent>
                                        ) : (null)
                                    }
                                </div>
                            )
                        }
                        <DialogActions>
                            <Button  
                                className={this.props.classes.buttonCancel} 
                                onClick={this.props.onClose}
                                variant="outlined"
                                disableElevation
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                }
            </Fragment>
        )
    }
}
  
export default withStyles(useStyles)(ConfirmationDialog)