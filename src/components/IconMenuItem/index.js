/* eslint-disable */
import React from 'react';
import {makeStyles, Button} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { grey } from '@material-ui/core/colors'

const useStyle = makeStyles({
    root:{
        padding:0
    },
    button:{
        justifyContent: "left",
        borderRadius: 0,
        color: grey[700],
        textTransform: "capitalize",
        fontSize: 13
    }
})

const ITEM_HEIGHT = 48;

const IconMenuItem = ({children, icon, text, disabled=false, ...props}) =>{

    const classes = useStyle(props)

    return(
        <MenuItem className={classes.root} disabled={disabled} {...props}>
                <Button
                    fullWidth
                    startIcon={icon}
                    disabled={disabled}
                    className={classes.button}
                >
                     {children ? children : text}
                </Button>
        </MenuItem>
    )
}


export default IconMenuItem