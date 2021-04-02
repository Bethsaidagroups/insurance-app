/* eslint-disable */
import React, { Component, Fragment } from 'react';
import {makeStyles} from '@material-ui/core';
import {green, red, blue, grey, yellow, orange} from '@material-ui/core/colors';

    const useStyle = makeStyles({
        root:{
            width: 'auto',
            paddingLeft: 5,
            paddingRight:5,
            paddingTop: 1,
            paddingBottom: 3,
            backgroundColor: props => {
                if((props.variant == 'active') || (props.variant == 'completed') || (props.variant == 'available') || (props.variant == 'paid') || (props.variant == 'paid')){
                    return green[500]
                }
                else if((props.variant == 'pending') || (props.variant == 'unused') || (props.variant == 'defered')){
                    return orange[500]
                }
                else if((props.variant == 'inactive') || (props.variant == 'declined') || (props.variant == 'unpaid') || (props.variant == 'canceled')){
                    return red[500]
                }
                else if((props.variant == 'default') || (props.variant == 'checked_out') || (props.variant == 'canceled')){
                    return grey[500]
                }
                else if((props.variant == 'on') || (props.variant == 'checked_out') || (props.variant == 'settled') || (props.variant == 'checked_in')){
                    return blue[400]
                }
                else{
                    return grey[500]
                }
            },
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: props => {
                if((props.variant == 'active') || (props.variant == 'completed') || (props.variant == 'available') || (props.variant == 'paid')){
                    return green[500]
                }
                else if((props.variant == 'pending') || (props.variant == 'unused') || (props.variant == 'defered')){
                    return orange[500]
                }
                else if((props.variant == 'inactive') || (props.variant == 'declined') || (props.variant == 'unpaid') || (props.variant == 'canceled')){
                    return red[500]
                }
                else if((props.variant == 'default') || (props.variant == 'checked_out') || (props.variant == 'canceled') || (props.variant == 'used')){
                    return grey[500]
                }
                else if((props.variant == 'on') || (props.variant == 'checked_out') || (props.variant == 'settled') || (props.variant == 'checked_in')){
                    return blue[400]
                }
                else{
                    return grey[500]
                }
            },
            borderRadius: 5,
            textAlign: "center",
            borderWidth: 1
        },
        text: {
            color: "#ffffff",
            fontSize: 13,
            textTransform: "uppercase",
            fontFamily: "calibri",
            fontWeight: 600,
        },
    })
const StatusBadge = ({children, ...props}) =>{
    const classes = useStyle(props)
    return(
        <div className={classes.root}>
            <span className={classes.text}>{children}</span>
        </div>
    )
}


export default StatusBadge