/* eslint-disable */
import React, {useState} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles,
  Avatar,
  CircularProgress,
  withStyles,
  createStyles
} from '@material-ui/core';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';
import { connect } from 'react-redux'
import {withSnackbar} from 'notistack'
import { setSessionUser, setSessionToken } from 'src/actions'
import { makeRequest, handleError } from 'src/utils/axios-helper'
import qs from 'qs'
import { useRouter } from 'src/utils'

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

class LoginView extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      username: "",
      password: "",
      isLoading: false
    }
  }

  handleLogin = (event) => {
    if(this.state.username && this.state.password){
      this.setState({isLoading:true})
      makeRequest().post('/auth/login', qs.stringify({username:this.state.username,password:this.state.password}))
      .then(response => {
          this.props.dispatch(setSessionToken(response.data.data.token))
          this.props.dispatch(setSessionUser(response.data.data.user))
          this.props.enqueueSnackbar(response.data.message, {variant:'success'});
          this.props.navigate('/app/dashboard');
      })
      .catch(error => {
          handleError({
              error: error,
              callbacks: {
              400: response=>{ this.props.enqueueSnackbar(response.data.message, {variant: "error"}); },
              404: response=>{ this.props.enqueueSnackbar(response.data.message, {variant: "error"}); }
              }
          }, this.props);
      })
      .finally(() => {
          this.setState({isLoading:false})
      })
    }
    else{
      this.props.enqueueSnackbar(`Incorrect staff username or password`, {variant:'error'});
    }
}
  render(){
    return (
      <Page
        className={this.props.classes.root}
        title="Login"
      >
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
        >
          <Container maxWidth="sm">
          <Box style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Avatar
                      src="/logo-main.png"
                      style={{height: 100, width: 100}}
                    />
                    <Typography>Bethsaida Micro Insurance Limited</Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    name="username"
                    value={this.state.username}
                    variant="outlined"
                    onChange={evt => this.setState({username:evt.target.value})}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    margin="normal"
                    name="password"
                    value={this.state.password}
                    variant="outlined"
                    type="password"
                    onChange={evt => this.setState({password:evt.target.value})}
                  />
                  <Box my={2}>
                    {
                      this.state.isLoading ? (
                        <CircularProgress size={35} />
                      ) : (
                        <Button
                          color="primary"
                          fullWidth
                          size="large"
                          variant="contained"
                          onClick={this.handleLogin}
                          disabled={!(this.state.username && this.state.password)}
                        >
                          Login in
                        </Button>
                      )
                    }
                  </Box>
          </Container>
        </Box>
      </Page>
    );
  }
  
};

const mapStateToProps = (state) => ({
  users: state.users
})

export default connect(mapStateToProps)(withSnackbar(withStyles(useStyles)(useRouter(LoginView))));
