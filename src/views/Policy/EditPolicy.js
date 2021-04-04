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
  IconButton,
  CircularProgress,
  Accordion,
  AccordionDetails,
  AccordionSummary
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
import { Add, Remove, ExpandMore} from '@material-ui/icons';
import withRouter from 'src/utils/useRouter'

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  },
  text:{
      fontSize: 12
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
        beneficiary: [{full_name:"", date_of_birth:"", relationship:"", phone_number:"", ppn:""}],
        policy_no: null,
        edit_log: [],
        policies: [],
        customers: [],
        selectedPolicyIndex: null,
        selectedPolicy: null,
        isLoading: true,
        expand: false
    }
  }

  handleUpdatePolicy = event =>{
    this.props.openDialog({
        viewCtrl: "warning",
        title: "Confirm Policy Update",
        description: "Make sure you have confirmed the details before you proceed from here",
        close: dialog =>{
            if(dialog.viewCtrl == "success"){
                //this.clearFields()
            }
            dialog.close()
        },
        confirm: dialog =>{
            makeRequest(this.props).post('/policy/update',qs.stringify({
                id:this.props.params.id,
                customer: this.state.customer,
                policy: this.state.policy,
                sum_assured: this.state.sum_assured,
                premium: this.state.premium,
                period: this.state.period,
                start_date: this.state.start_date,
                beneficiary: this.state.beneficiary,
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
        password_verify: "",
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
    
  }

  componentDidMount(){
    this.fetchCustomer()
    makeRequest(this.props).get('/policy/all')
    .then(response => {
       this.setState({
            policies:response.data.data.list,
        })
    
        makeRequest(this.props).get('/policy/customer/get/'+this.props.params.id)
        .then(response => {
            //get policy index
            for (let index = 0; index < this.state.policies.length; index++) {
                if(this.state.policies[index].id == response.data.data.policy.policy_id) {
                    this.setState({selectedPolicyIndex:index, selectedPolicy:this.state.policies[index]})
                    break;
                }  
            }
            //alert(JSON.parse((JSON.parse(response.data.data.policy.edit_log)[0].data.beneficiary))[0].full_name)
            this.setState({
                customer: response.data.data.policy.customer_id,
                policy: response.data.data.policy.policy_id,
                premium: response.data.data.policy.premium,
                period: response.data.data.policy.period,
                start_date: response.data.data.policy.start_date,
                policy_no: response.data.data.policy.policy_no,
                beneficiary: JSON.parse(response.data.data.policy.beneficiary),
                isLoading: false,
                edit_log:  JSON.parse(response.data.data.policy.edit_log),
                ...JSON.parse(response.data.data.policy.policy_details)
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

  onPolicyChange = event =>{
      this.setState({
          selectedPolicy: this.state.policies[event.target.value], 
          selectedPolicyIndex: event.target.value,
          policy: this.state.policies[event.target.value].id
        })
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
                    title="Edit Policy"
                    subheader="Edit Policy Details"
                    action={<Button variant="outlined" onClick={evt=>this.clearFields()}>Clear</Button>}
                />
                <Divider/>
                <CardContent>
                    {
                        this.state.isLoading ? (
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={350}>
                                <CircularProgress/>
                            </Box>
                        ) : (
                            <>
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
                                            label="Start Date"
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
                                                        onChange={e => this.setState({[field.var_name]:e.target.value})}
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
                            </>
                        )
                    }
                    <Divider style={{marginTop:15, marginBottom:15}}/>
                    {
                        this.state.edit_log &&  
                        <Box maxHeight={350} style={{overflowY:"auto", overflowX:"hidden"}}>
                            <Typography styles={{marginTop:10}}><strong>Change Log</strong></Typography>
                                    {
                                        this.state.edit_log.map((log,index)=>(
                                            <>
                                                <Typography>{index+1}</Typography>
                                                <Grid container spacing={2} style={{marginTop: 20}}>
                                                    <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                                        <Typography className={this.props.classes.text}><strong>Customer</strong></Typography>
                                                        <Typography className={this.props.classes.text}>{log.data.customer}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                                        <Typography className={this.props.classes.text}><strong>Policy</strong></Typography>
                                                        <Typography className={this.props.classes.text}>{log.data.policy}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                                        <Typography className={this.props.classes.text}><strong>Period</strong></Typography>
                                                        <Typography className={this.props.classes.text}>{log.data.period} Years</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                                        <Typography className={this.props.classes.text}><strong>Commencement Date</strong></Typography>
                                                        <Typography className={this.props.classes.text}>{log.data.start_date}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                                        <Typography className={this.props.classes.text}><strong>Premium</strong></Typography>
                                                        <Typography className={this.props.classes.text}>{log.data.premium}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                                        <Typography className={this.props.classes.text}><strong>Sum Assured</strong></Typography>
                                                        <Typography className={this.props.classes.text}>{log.data.policy_details.sum_assured}</Typography>
                                                    </Grid>
                                                </Grid>
                                              
                                                <Typography style={{marginTop:15, marginBottom:-20}}>Beneficiaries</Typography>
                                                {
                                                    JSON.parse(log.data.beneficiary).map((data,index)=>(
                                                        <Grid container spacing={2} style={{marginTop: 20}}>
                                                            <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                                                <Typography className={this.props.classes.text}><strong>Full Name</strong></Typography>
                                                                <Typography className={this.props.classes.text}>{data.full_name}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                                                                <Typography className={this.props.classes.text}><strong>Date Of Birth</strong></Typography>
                                                                <Typography className={this.props.classes.text}>{data.date_of_birth}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                                                                <Typography className={this.props.classes.text}><strong>Relationship</strong></Typography>
                                                                <Typography className={this.props.classes.text}>{data.relationship}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                                                                <Typography className={this.props.classes.text}><strong>Phone Number</strong></Typography>
                                                                <Typography className={this.props.classes.text}>{data.phone_number}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                                                                <Typography className={this.props.classes.text}><strong>ppn</strong></Typography>
                                                                <Typography className={this.props.classes.text}>{data.ppn} %</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    ))
                                                }
                                                <Typography className={this.props.classes.text} style={{marginTop:10}}>Edited By <strong>{log.staff.name}</strong> on <strong>{log.date}</strong></Typography>
                                                <Divider style={{marginTop:15, marginBottom:15}}/>
                                            </>
                                        ))
                                    }
                        </Box>
                    }
                </CardContent>
                <CardActions>
                   <Button disableElevation disabled={this.state.agents < 1}  variant="contained" color="primary" onClick={this.handleUpdatePolicy}>Update Policy</Button>
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
            withPermission(VIEW_PERMISSION_NAME)(withConfirmationDialog(useRouter(AddPolicy))))));