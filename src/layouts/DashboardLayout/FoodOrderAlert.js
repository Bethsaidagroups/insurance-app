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
import { NotificationImportant as NotificationIcon } from '@material-ui/icons'
import { green, red } from '@material-ui/core/colors';

const useStyles = createStyles(theme => ({
    dialogContent: {
        minHeight: 300,
        display: "flex",
        flexDirection:  "column",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        width: 100,
        height: 100,
        backgroundColor: green[500],
        marginBottom: 35
    },
    topHeader:{
        fontSize: 17,
        color: "#333333",
        fontWeight: 500,
    },
    title: {
        fontSize: 20,
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

class FoodOrderAlert extends Component{
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
        }
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
                        New Food Order Alert
                    </DialogTitle>
                    <Divider style={{marginTop:5,marginBottom:10}}/>
                    <DialogContent className={this.props.classes.dialogContent}>
                        <Avatar className={this.props.classes.avatar} variant="circle">
                            <NotificationIcon style={{fontSize:70}}/>
                        </Avatar>
                        <Typography component="h4" className={this.props.classes.title}>New Food Order Alert!</Typography>
                        <Typography className={this.props.classes.text}>Please Check your Food Order table to view new Orders!</Typography>
                        <Button variant="contained" style={{marginTop: 15}} onClick={this.props.onClose} color="primary">Ok</Button>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

export default withStyles(useStyles)(FoodOrderAlert);