/* eslint-disable */
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles, Box, Avatar, Button, CircularProgress} from '@material-ui/core';
import { Lock as LockIcon } from '@material-ui/icons';
import { Navigate, withRouter } from 'react-router-dom'
import { useRouter } from 'src/utils'

const useStyles = makeStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 30
  },
  icon:{
    fontSize: 50,
    color: '#fff'
  }
});

const DataViewLoader = ({isLoading, data, loader, children, history, ...props}) => {
  
  const classes = useStyles();
  
  const refresh = evt =>{
      
  }
  return (
    <React.Fragment>
        {isLoading ? (
            (loader == "skeleton") ? (
                <Skeleton variant="rect" height={300} width="100%"/>
            ) :(
                <Box className={classes.body}>
                    <CircularProgress className={classes.circularProgress}/>
                </Box>
            )
        ) : (
            (!(data === undefined || data.length == 0)) ? (
                children
            ) : (
                    <Box className={classes.body}>
                        <Avatar className={classes.avatar}>
                            <LockIcon className={classes.icon}/>
                        </Avatar>
                        <p>There is no data to display. If you believe this is an error please contact the System administrator</p>
                        <Button variant="contained" color="primary" disableElevation onClick={refresh}>Refresh</Button>
                    </Box>
            )
        )}
    </React.Fragment>
  );
}

export default useRouter(DataViewLoader)