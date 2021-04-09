/* eslint-disable */
import React from 'react';
import {
  Box,
  Container,
  withStyles,
  createStyles,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  Divider,
  CardActions,
  Typography,
  TextField,
  MenuItem
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import { connect } from 'react-redux'
import {withSnackbar} from 'notistack'
import { setUser } from 'src/actions'
import withConfirmationDialog from 'src/utils/confirmationDialog'
import { uniqueId } from 'lodash';
import {makeRequest, handleError} from 'src/utils/axios-helper';
import { withPermission, useRouter } from 'src/utils';
import qs from 'qs'

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));


class UpdatePassword extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        password: "",
        password_verify: ""
    }
  }

  handleUpdate = event =>{
    if(this.state.password && this.state.password_verify){
        
            this.props.openDialog({
                viewCtrl: "warning",
                title: "Confirm Password Update",
                description: "Make sure you have confirmed the details before you proceed from here",
                close: dialog =>{
                    if(dialog.viewCtrl == "success"){
                        this.clearFields()
                    }
                    dialog.close()
                },
                confirm: dialog =>{
                    makeRequest(this.props).post('/auth/pwd-change',qs.stringify({
                        password: this.state.password,
                        retype_password: this.state.password_verify
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
        password: "",
        password_verify: ""
      })
  }

  render(){
    return(
      <Page
        className={this.props.classes.root}
        title="Chnage Password"
      >
        <Container maxWidth={false}>
            <Card>
                <CardHeader
                    title="Change password"
                    subheader="Change your Password below"
                    action={<Button variant="outlined" onClick={evt=>this.clearFields()}>Clear</Button>}
                />
                <Divider/>
                <CardContent>
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
                </CardContent>
                <CardActions>
                   <Button 
                    disableElevation 
                    variant="contained" 
                    color="primary" 
                    onClick={this.handleUpdate}
                    disabled={ ((this.state.password.length < 6) || (this.state.password !== this.state.password_verify))}
                    >
                        Change Password
                    </Button>
                </CardActions>
            </Card>
        </Container>
      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  session_token: state.session_token,
})
export default connect(mapStateToProps)(
    withSnackbar(
        withStyles(useStyles)(
            withConfirmationDialog(UpdatePassword))));