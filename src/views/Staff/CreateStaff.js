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

const VIEW_PERMISSION_NAME = [];

class CreateStaff extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        staff_id: null,
        first_name: null,
        last_name: null,
        gender: null,
        email: null,
        position: null,
        password: "",
        password_verify: ""
    }
  }

  handleCreateStaff = event =>{
    if(this.state.first_name && this.state.last_name && this.state.email && this.state.gender && this.state.position && this.state.username && this.state.password){
        if((this.state.password.length >= 6) && (this.state.password === this.state.password_verify)){
            this.props.openDialog({
                viewCtrl: "warning",
                title: "Confirm New Staff",
                description: "Make sure you have confirmed the details before you proceed from here",
                close: dialog =>{
                    if(dialog.viewCtrl == "success"){
                        this.clearFields()
                    }
                    dialog.close()
                },
                confirm: dialog =>{
                    makeRequest(this.props).post('/admin/add',qs.stringify({
                        username: this.state.username,
                        first_name: this.state.first_name,
                        last_name: this.state.last_name,
                        email: this.state.email,
                        gender: this.state.gender,
                        position: this.state.position,
                        password: this.state.password,
                    }))
                        .then(response => {
                            dialog.setViewCtrl("success")
                            dialog.setTitle("Staff Created!")
                            dialog.setDescription(
                                <Typography>
                                    {response.data.message}
                                </Typography>
                            )
                        })
                        .catch(error => {
                            handleError({
                                error: error,
                                callbacks: {
                                    400: response=>{ 
                                        this.props.enqueueSnackbar(response.data.message, {variant: "error"}); 
                                        dialog.setViewCtrl("")
                                    }
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
            this.props.enqueueSnackbar("Password must match and must be 6 characters or more", {variant:'warning'});
        }
    }
    else{
        this.props.enqueueSnackbar("All fields are required to create a new staff", {variant:'warning'});
    }
  }

  clearFields = () =>{
      this.setState({
        username: "",
        first_name: "",
        last_name: "",
        gender: "",
        email: "",
        position: "",
        password: "",
        password_verify: ""
      })
  }

  render(){
    return(
      <Page
        className={this.props.classes.root}
        title="Create Staff"
      >
        <Container maxWidth={false}>
            <Card>
                <CardHeader
                    title="Add New Staff"
                    subheader="Create new staffs by filling the form below"
                    action={<Button variant="outlined" onClick={evt=>this.clearFields()}>Clear</Button>}
                />
                <Divider/>
                <CardContent>
                    <Grid container spacing={2} style={{marginTop: 20}}>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="username"
                                name="username"
                                value={this.state.username}
                                onChange={e => this.setState({username:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="First Name"
                                name="first_name"
                                value={this.state.first_name}
                                onChange={e => this.setState({first_name:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Last Name"
                                name="last_name"
                                value={this.state.last_name}
                                onChange={e => this.setState({last_name:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Gender"
                                name="gender"
                                value={this.state.gender}
                                onChange={e => this.setState({gender:e.target.value})}
                                select
                            >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Email"
                                name="email"
                                value={this.state.email}
                                onChange={e => this.setState({email:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Position"
                                name="position"
                                value={this.state.position}
                                onChange={e => this.setState({position:e.target.value})}
                                select
                            >
                                <MenuItem value="Administrator">Administrator</MenuItem>
                                <MenuItem value="Account Officer">Acount Officer</MenuItem>
                                <MenuItem value="General Manager">General Manager</MenuItem>
                                <MenuItem value="Under Writer">Underwitter</MenuItem>
                                <MenuItem value="Marketer">Marketer/Agent</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Password"
                                name="password"
                                type="password"
                                value={this.state.password}
                                onChange={e => this.setState({password:e.target.value})}
                                helperText="Password must be 6 charcaters or more"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Verify Password"
                                name="password_verify"
                                type="password"
                                value={this.state.password_verify}
                                onChange={e => this.setState({password_verify:e.target.value})}
                                helperText="Verify Password"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                   <Button disableElevation variant="contained" color="primary" onClick={this.handleCreateStaff}>Create Staff</Button>
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
            withPermission(VIEW_PERMISSION_NAME)(withConfirmationDialog(CreateStaff)))));