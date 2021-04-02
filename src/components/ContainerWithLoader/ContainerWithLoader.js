/* eslint-disable */
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress, LinearProgress, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    circularProgressBox: {
        display: "flex",
        justifyContent: "center",
        alignContent: 'center',
        align:'center',
      },

    circularProgress:{
      size: props => props.size,
      color: props => props.color
    },

    linearProgress:{
      color: props => props.color
    },

    component:{
      display: "flex",
      justifyContent: "center",
      alignContent: 'center',
      align:'center'
    }
}));

const ContainerWithLoader = props => {
  const { size=30, color="#1e915b", isLoading, loader, component ='div', children} = props;

  const classes = useStyles({size, color});

  return (
      (isLoading ? (
        <div className={classes.circularProgressBox} >
            {(loader=="linear")?(
              <LinearProgress color="secondary" />
            ):(
              <CircularProgress className={classes.circularProgress} size={size}/>
            )}
        </div>
      ):(
          (component=="span" ? (
            <div>
              {children}
            </div>
          ):(
            <Box className={classes.component}>
              {children}
            </Box>
          ))
      ))
  );
};

ContainerWithLoader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  loader:PropTypes.string,
  children: PropTypes.node.isRequired,
  component: PropTypes.string
};

export default ContainerWithLoader;
