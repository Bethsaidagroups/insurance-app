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
import Agent from '../Agent';
import { Field } from 'formik';

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

class AddPolicy extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        policy: null,
        customer: null,
        sum_assured: null,
        premium: null,
        period: null,
        start_date: null,
        policies: [],
        customers: [],
        selectedPolicyIndex: null,
        selectedPolicy: null
    }
  }

  handleAddPolicy = event =>{
    this.props.openDialog({
        viewCtrl: "warning",
        title: "Confirm New Policy",
        description: "Make sure you have confirmed the details before you proceed from here",
        close: dialog =>{
            if(dialog.viewCtrl == "success"){
                //this.clearFields()
            }
            dialog.close()
        },
        confirm: dialog =>{
            makeRequest(this.props).post('/policy/add',qs.stringify({
                customer: this.state.customer,
                policy: this.state.policy,
                sum_assured: this.state.sum_assured,
                premium: this.state.premium,
                period: this.state.period,
                start_date: this.state.start_date,
            }))
                .then(response => {
                    dialog.setViewCtrl("success")
                    dialog.setTitle("Done!")
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

  fetchCustomer = ()=>{
    makeRequest(this.props).post('/customer/list/all')
    .then(response => {
       this.setState({
           customers:response.data.data.list,
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

  fetchPolicy = ()=>{
    makeRequest(this.props).get('/policy/all')
    .then(response => {
       this.setState({
            policies:response.data.data.list,
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

  componentDidMount(){
    this.fetchCustomer()
    this.fetchPolicy()
  }

  onPolicyChange = event =>{
      this.setState({
          selectedPolicy: this.state.policies[event.target.value], 
          selectedPolicyIndex: event.target.value,
          policy: this.state.policies[event.target.value].id
        })
  }

  render(){
    return(
      <Page
        className={this.props.classes.root}
        title="Add Policy"
      >
        <Container maxWidth={false}>
            <Card>
                <CardHeader
                    title="Add Policy"
                    subheader="Create new Policy by filling the form below"
                    action={<Button variant="outlined" onClick={evt=>this.clearFields()}>Clear</Button>}
                />
                <Divider/>
                <CardContent>
                    <Grid container spacing={2} style={{marginTop: 20}}>
                        
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Customer"
                                name="customer"
                                value={this.state.customer}
                                onChange={e => this.setState({customer:e.target.value})}
                                select
                                disabled={this.state.customers < 1}
                            >
                                {
                                    this.state.customers.map(customer=>(
                                        <MenuItem value={customer.id}>{`${customer.surname} ${customer.first_name} ${customer.other_name}`}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Policy"
                                name="policy"
                                value={this.state.selectedPolicyIndex}
                                onChange={this.onPolicyChange}
                                select
                                disabled={this.state.policies < 1}
                            >
                                {
                                    this.state.policies.map((policy,index)=>(
                                        <MenuItem value={index}>{policy.name}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Premium"
                                name="premium"
                                value={this.state.premium}
                                onChange={e => this.setState({premium:e.target.value})}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Star Date"
                                name="start_date"
                                type="date"
                                value={this.state.start_date}
                                onChange={e => this.setState({start_date:e.target.value})}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Period"
                                name="period"
                                value={this.state.period}
                                onChange={e => this.setState({period:e.target.value})}
                                helperText="Period in number days"
                            />
                        </Grid>

                        {
                            this.state.selectedPolicy ? (
                                JSON.parse(this.state.selectedPolicy.options).form_fields.map(field=>(
                                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            label={field.label}
                                            name={field.var_name}
                                            value={this.state[field.var_name]}
                                            type={field.type}
                                            onChange={e => this.setState({[field.var_name]:e.target.value})}
                                        />
                                    </Grid>
                                ))
                            ) : (
                                null
                            )
                        }
                    </Grid>
                </CardContent>
                <CardActions>
                   <Button disableElevation disabled={this.state.agents < 1}  variant="contained" color="primary" onClick={this.handleAddPolicy}>Add Policy</Button>
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
            withPermission(VIEW_PERMISSION_NAME)(withConfirmationDialog(AddPolicy)))));