/* eslint-disable */
import React, { Component, Fragment } from 'react';
import {Box, Button, Avatar, Typography, createStyles, withStyles} from '@material-ui/core';
import { LockRounded as LockIcon} from '@material-ui/icons'

const useStyles = createStyles(theme => ({
    body: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '75vh'
    },
    avatarLocked: {
        width: 150,
        height: 150,
        marginBottom: 30
    },
    icon:{
        fontSize: 100,
        color: '#fff'
    },
    smallText: {
        fontSize: 13,
        color: "#555555",
        marginTop: 20,
        marginBottom: 20
    }
}))

class NoPermissionView extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Fragment>
                    <Box className={this.props.classes.body}>
                        <Avatar className={this.props.classes.avatarLocked}>
                            <LockIcon className={this.props.classes.icon}/>
                        </Avatar>
                        <Typography component="h3" variant="h6">
                            Permission Denied!
                        </Typography>
                        <Typography component="p" variant="p">You are seeing this because you don't have the required permission to view this page</Typography>
                        <Typography className={this.props.classes.smallText}>If you believe this is an error; please reload browser frame!</Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disableElevation 
                            onClick={evt => {null}}
                        >
                            Reload
                        </Button>
                    </Box>
            </Fragment>
        )
    }
}
  
export default withStyles(useStyles)(NoPermissionView)