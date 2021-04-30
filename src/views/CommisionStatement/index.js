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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@material-ui/core';
import Page from 'src/components/Page';
import { connect } from 'react-redux'
import {withSnackbar} from 'notistack'
import { setUser } from 'src/actions'
import withConfirmationDialog from 'src/utils/confirmationDialog'
import { uniqueId } from 'lodash';
import {makeRequest, handleError} from 'src/utils/axios-helper';
import { withPermission, useRouter } from 'src/utils';
import qs from 'qs'
import moment from 'moment'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import CommissionPrintTemplate from './CommissionTemplate'

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

class Commission extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        months: [],
        isLoadingView: true,
        selected_date: "",
        agents: [],
        agent_id: null,
        start_date: null,
        end_date: null,
        isLoadingCommission: true,
        openCommission: false,
        list: []
    }
  }

  componentDidMount(){
    this.fetchAgents();
    makeRequest(this.props).get('/commission/months')
        .then(response => {
            this.setState({months:response.data.data.dates, isLoadingView:false})
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
            this.setState({isLoadingView:false})
        })
 }

 fetchAgents(){
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

  generate = event =>{
    this.props.openDialog({
        viewCtrl: "warning",
        title: "Confirm Action!",
        description: "Are you sure you want to generate commission statement for all marketers/agent for the selected month",
        close: dialog =>{
            dialog.close()
        },
        confirm: dialog =>{
            makeRequest(this.props).get('/commission/generate/'+this.state.selected_date)
                .then(response => {
                    dialog.setViewCtrl("success")
                    dialog.setTitle("Completed")
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

  printCommission = () => {
    this.setState({openCommission:true, isLoadingCommission:true})
    makeRequest(this.props).post('/commission/statement', qs.stringify({
        agent_id:this.state.agent_id,
        start_date:this.state.start_date,
        end_date:this.state.end_date
    }))
    .then(response => {
        this.setState({list:response.data.data.list, isLoadingCommission:false})
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
        title="Commission Statement"
      >

                <Dialog open={this.state.openCommission} maxWidth="md" fullWidth onClose={e=>this.setState({openCommission:false})}>
                    <DialogTitle>Commission Statement</DialogTitle>
                    <DialogContent>
                        {this.state.isLoadingCommission ? (
                                <CircularProgress size={30}/>
                            ) : (
                                <CommissionPrintTemplate 
                                    start_date={this.state.start_date} 
                                    end_date={this.state.end_date} 
                                    list={this.state.list} 
                                    ref={el => (this.componentRefP = el)}
                                />
                            ) 
                        }
                    </DialogContent>
                    <DialogActions>
                        <ReactToPrint content={() => this.componentRefP}>
                            <PrintContextConsumer>
                                {({ handlePrint }) => (
                                    <Button  onClick={handlePrint} variant="contained" color="primary">Print</Button>
                                )}
                            </PrintContextConsumer>
                        </ReactToPrint>
                    </DialogActions>
                </Dialog>
        <Container maxWidth={false}>
            <Card>
                <CardHeader
                    title="Commission Statement"
                    subheader="Generate, View and Print Agent/Marketer commission statement"
                    action={<Button variant="outlined" onClick={evt=>this.clearFields()}>Clear</Button>}
                />
                <Divider/>
                <CardContent>
                    <Typography variant="h5" component="h5" >Run Commission Statement</Typography>
                    <Typography variant="caption" component="small">Note that running commission statement for a new month 
                        will automatically deactivate payment posting for previous month
                    </Typography>
                    <Typography style={{fontWeight: "bold"}} variant="caption" component="p">Today: {moment().format("Do MMMM, YYYY")}</Typography>
                    <Grid container spacing={2} style={{marginTop: 20}}>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Select Month"
                                name="selected_date"
                                value={this.state.selected_date}
                                onChange={e => this.setState({selected_date:e.target.value})}
                                select
                            >
                                {this.state.months.map((item,index)=>(
                                    <MenuItem value={`${item.year}-${item.month}`}>{moment(item.year+item.month+"01","YYYYMMDD").format("MMMM, YYYY")}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <Button disableElevation variant="contained" color="primary" default={!this.state.selected_date} onClick={this.generate}>Generate</Button>
                        </Grid>
                    </Grid>
                    <Divider style={{marginTop:30}}/>
                    <Typography variant="h5" component="h5" >View Commission Statement</Typography>
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
                                label="End Date"
                                name="end_date"
                                type="date"
                                value={this.state.end_date}
                                onChange={e => this.setState({end_date:e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                <Button disableElevation variant="contained" color="primary" onClick={this.printCommission}>View Statement</Button>
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
            withPermission(VIEW_PERMISSION_NAME)(withConfirmationDialog(Commission)))));