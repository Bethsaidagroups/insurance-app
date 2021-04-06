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

class AddPolicy extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        policy: null,
        customer: null,
        sum_assured: 0,
        premium: null,
        period: 1,
        start_date: null,
        beneficiary: [{full_name:"", date_of_birth:"", relationship:"", phone_number:"", ppn:""}],
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
                this.clearFields()
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
                beneficiary: this.state.beneficiary
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
        policy: "",
        customer: "",
        sum_assured: 0,
        premium: "",
        period: 1,
        start_date: "",
        beneficiary: [{full_name:"", date_of_birth:"", relationship:"", phone_number:"", ppn:""}],
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
          policy: this.state.policies[event.target.value].id,
        })
  }
onChange = (event) =>{
    if(this.state.selectedPolicy && (this.state.selectedPolicy.var_name != "bta")){
        if(event.target.name == "premium"){
            this.setState({sum_assured: parseFloat(this.state.period) * 12 * parseFloat(event.target.value)})
        }
        else if(event.target.name == "period"){
            this.setState({sum_assured: parseFloat(event.target.value) * 12 * parseFloat(this.state.premium)})
        }
        else{
            this.setState({[event.target.name]:event.target.value})
        }
        this.setState({[event.target.name]:event.target.value})
    }
    else{
        this.setState({[event.target.name]:event.target.value})
    }
}

onChangeText = (event, index) =>{
    let rows = this.state.beneficiary
    rows[index][event.target.name] = event.target.value
    this.setState({beneficiary:rows});
}

ctrlBeneficiaryRow = (type) =>{
  if(type == "add"){
      let rows = this.state.beneficiary
      rows.push({full_name:"", date_of_birth:"", relationship:"", phone_number:"", ppn:""})
      this.setState({beneficiary:rows});
  }
  else{
      if(this.state.beneficiary.length > 1){
        let rows = this.state.beneficiary
        rows.pop()
        this.setState({beneficiary:rows});
      }
  }
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
                                onChange={this.onChange}
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
                                onChange={this.onChange}
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
                                onChange={this.onChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Period"
                                name="period"
                                value={this.state.period}
                                onChange={this.onChange}
                                select
                            >
                                <MenuItem value="1">1 Year</MenuItem>
                                <MenuItem value="2">2 Years</MenuItem>
                                <MenuItem value="3">3 Years</MenuItem>
                                <MenuItem value="4">4 Years</MenuItem>
                                <MenuItem value="5">5 Years</MenuItem>
                            </TextField>
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
                                            onChange={this.onChange}
                                            disabled={this.state.selectedPolicy ? this.state.selectedPolicy.var_name != "bta" : false}
                                        />
                                    </Grid>
                                ))
                            ) : (
                                null
                            )
                        }
                    </Grid>
                    <Typography style={{marginTop: 25}}>Beneficiaries</Typography>
                    <Divider/>
                    {
                        this.state.beneficiary.map((list, index)=>(
                            <Grid container spacing={2} style={{marginTop: 20}}>
                                <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Full Name"
                                        name="full_name"
                                        value={this.state.beneficiary[index].full_name}
                                        onChange={e => this.onChangeText(e,index)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Date Of Birth"
                                        name="date_of_birth"
                                        type="date"
                                        value={this.state.beneficiary[index].date_of_birth}
                                        onChange={e => this.onChangeText(e,index)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Relationship"
                                        name="relationship"
                                        value={this.state.beneficiary[index].relationship}
                                        onChange={e => this.onChangeText(e,index)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Phone Number"
                                        name="phone_number"
                                        value={this.state.beneficiary[index].phone_number}
                                        onChange={e => this.onChangeText(e,index)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="PPN(%)"
                                        name="ppn"
                                        value={this.state.beneficiary[index].ppn}
                                        onChange={e => this.onChangeText(e,index)}
                                    />
                                </Grid>
                            </Grid>
                        ))
                    }
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                        <IconButton color="primary" onClick={e=>this.ctrlBeneficiaryRow("remove")}>
                            <Remove/>
                        </IconButton>
                        <IconButton color="primary" onClick={e=>this.ctrlBeneficiaryRow("add")}>
                            <Add/>
                        </IconButton>
                    </Box>
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