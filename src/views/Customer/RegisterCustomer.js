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
  MenuItem,
  IconButton
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
import Agent from '../Agent';
import { Add, Remove } from '@material-ui/icons';

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

class CreateCustomer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        agent_id: null,
        surname: null,
        first_name: null,
        other_name: null,
        gender: null,
        email: null,
        phone_number: null,
        address: null,
        date_of_birth: null,
        occupation: null,
        marital_status: null,
        town: null,
        state_of_origin: null,
        mode_of_identification: null,
        id_no: null,
        height: null,
        weight: null,
        agents: [],
        isLoading: false
    }
  }

  handleCreateCustomer = event =>{
    if(this.state.agent_id && this.state.surname && this.state.first_name && this.state.other_name && this.state.email && this.state.gender && this.state.phone_number && this.state.occupation && this.state.marital_status){
        this.props.openDialog({
            viewCtrl: "warning",
            title: "Confirm New Customer",
            description: "Make sure you have confirmed the details before you proceed from here",
            close: dialog =>{
                if(dialog.viewCtrl == "success"){
                    //this.clearFields()
                }
                dialog.close()
            },
            confirm: dialog =>{
                makeRequest(this.props).post('/customer/add',qs.stringify({
                    agent_id: this.state.agent_id,
                    surname: this.state.surname,
                    first_name: this.state.first_name,
                    other_name: this.state.other_name,
                    gender: this.state.gender,
                    email: this.state.email,
                    phone_number: this.state.phone_number,
                    address: this.state.address,
                    date_of_birth: this.state.date_of_birth,
                    occupation: this.state.occupation,
                    marital_status: this.state.marital_status,
                    town: this.state.town,
                    state_of_origin: this.state.state_of_origin,
                    mode_of_identification: this.state.mode_of_identification,
                    id_no: this.state.id_no,
                    height: this.state.height,
                    weight: this.state.weight,
                }))
                    .then(response => {
                        dialog.setViewCtrl("success")
                        dialog.setTitle("Customer Created!")
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
        this.props.enqueueSnackbar("All fields are required to create a new customer", {variant:'warning'});
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

  componentDidMount(){
    makeRequest(this.props).post('/agent/list/all')
    .then(response => {
       this.setState({
           agents:response.data.data.list,
        })
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

  render(){
    return(
      <Page
        className={this.props.classes.root}
        title="Create Staff"
      >
        <Container maxWidth={false}>
            <Card>
                <CardHeader
                    title="Add New Customer"
                    subheader="Create new Customer by filling the form below"
                    action={<Button variant="outlined" onClick={evt=>this.clearFields()}>Clear</Button>}
                />
                <Divider/>
                <CardContent>
                    <Grid container spacing={2} style={{marginTop: 20}}>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Agent/Marketer"
                                name="agent_id"
                                value={this.state.agent_id}
                                onChange={e => this.setState({agent_id:e.target.value})}
                                select
                                disabled={this.state.agents < 1}
                            >
                                {
                                    this.state.agents.map(agent=>(
                                        <MenuItem value={agent.id}>{`${agent.first_name} ${agent.last_name} (${agent.agent_code})`}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Surname"
                                name="surname"
                                value={this.state.surname}
                                onChange={e => this.setState({surname:e.target.value})}
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
                                label="Other Name"
                                name="other_name"
                                value={this.state.other_name}
                                onChange={e => this.setState({other_name:e.target.value})}
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
                                label="Phone Number"
                                name="phone_number"
                                value={this.state.phone_number}
                                onChange={e => this.setState({phone_number:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Address"
                                name="address"
                                value={this.state.address}
                                onChange={e => this.setState({address:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Date of Birth"
                                name="date_of_birth"
                                type="date"
                                value={this.state.date_of_birth}
                                onChange={e => this.setState({date_of_birth:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Occupation"
                                name="occupation"
                                value={this.state.occupation}
                                onChange={e => this.setState({occupation:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Marital Status"
                                name="marital_status"
                                value={this.state.marital_status}
                                onChange={e => this.setState({marital_status:e.target.value})}
                                select
                            >
                                <MenuItem value="single">Single</MenuItem>
                                <MenuItem value="married">Married</MenuItem>
                                <MenuItem value="divorced">Divorced</MenuItem>
                                <MenuItem value="rather not say">Rather Not Say</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Town"
                                name="town"
                                value={this.state.town}
                                onChange={e => this.setState({town:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="State of Origin"
                                name="state_of_origin"
                                value={this.state.state_of_origin}
                                onChange={e => this.setState({state_of_origin:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Mode of Identification"
                                name="mode_of_identification"
                                value={this.state.mode_of_identification}
                                onChange={e => this.setState({mode_of_identification:e.target.value})}
                                select
                            >
                                <MenuItem value="national identity card">National Identity Card (NIMC)</MenuItem>
                                <MenuItem value="international passport">International Passport</MenuItem>
                                <MenuItem value="drivers license">Drivers License</MenuItem>
                                <MenuItem value="voters card">Voters Card</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Identity No"
                                name="id_no"
                                value={this.state.id_no}
                                onChange={e => this.setState({id_no:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Height"
                                name="height"
                                value={this.state.height}
                                onChange={e => this.setState({height:e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Weight"
                                name="weight"
                                value={this.state.weight}
                                onChange={e => this.setState({weight:e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                   <Button disableElevation disabled={this.state.agents < 1}  variant="contained" color="primary" onClick={this.handleCreateCustomer}>Register Customer</Button>
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
            withPermission(VIEW_PERMISSION_NAME)(withConfirmationDialog(CreateCustomer)))));