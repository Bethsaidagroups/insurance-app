/* eslint-disable */
import React from 'react';
import Page from 'src/components/Page';
import TableMaker from 'src/components/TableMaker';
import StatusBadge from 'src/components/StatusBadge';
import PopoverMenu from 'src/components/PopoverMenu';
import IconMenuItem from 'src/components/IconMenuItem';
import Toolbar from './Toolbar';
import getInitials from 'src/utils/getInitials';

import { Edit as EditIcon, 
    VpnKey as PermissionIcon, 
    Block as BlockIcon, 
    Check as CheckIcon,
    Lock as LockIcon,
    VpnLock,
    Settings,
    Person,
    PersonAdd,
    Delete,
    Refresh
} from '@material-ui/icons'
import { 
    TableRow,
    TableCell, 
    Avatar,
    withStyles,
    createStyles,
    Typography,
    Box,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Divider,
    Grid,
    TextField,
    DialogActions,
    CircularProgress
} from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux'
import DataViewLoader from 'src/components/DataViewLoader';
import {makeRequest, handleError} from 'src/utils/axios-helper';
import { withPermission, useRouter } from 'src/utils';
import { setSelectedUser } from 'src/actions'
import DataLayoutWraper from 'src/layouts/DataLayoutWraper';
import qs from 'qs'
import moment from 'moment'

const useStyles = createStyles( theme => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    boxOuter:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"left"
    },
    boxInner:{
        marginTop: 10,
        marginLeft: 5
    },
    avatar: {
        width: 60,
        height: 60,
        backgroundColor: deepOrange[400]
    },
    name:{
        fontSize: 13,
        color: '#111111',
        margin: 0
    },
    typo:{
        fontSize: 13,
    },
    position:{
        fontSize: 12,
        color: '#888888',
        marginTop: 2
    }
}))

const VIEW_PERMISSION_NAME = [];

class Customer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            columns: [
                {label:'Full Name'},
                {label:'Policy No'},
                {label:'Reference'},
                {label:'Amount'},
                {label:'Status'},
                {label:'Initialized By'},
                {label:'Approved By'},
                {label:'Narration'},
                {label:'Timestamp'},
                {label:'Action'}
            ],
            rows: [],
            count: 0,
            page: 0,
            options: {
                rowsPerPage: 5,
                onChangePage: this.onChangePage
            },
            isLoading: true,
            open: false,
            selectedStaff: null,
            selectedIndex: null,
            filters: null,
            policy_no: null,
            isLoadingVerify: false,
        }
    }
    
    onChangePage = (event, page) =>{
        this.setState({isLoading:true, page: page})
        makeRequest(this.props).post('/customer/list/' + (page+1), qs.stringify(this.state.filters))
        .then(response => {
           this.setState({
               rows:response.data.data.list,
               count: response.data.data.count
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
            this.setState({isLoading:false});
        })
    }

    statusToBadgeVariant = status =>{
        if(status){
            return "active";
        }
        else{
            return "inactive";
        }
    }

    componentDidMount(){
        //check if token is valid
        makeRequest(this.props).post('/payment/list')
            .then(response => {
                this.setState({rows: response.data.data.list, count: response.data.data.count})
            })
            .catch(error => {
                handleError({
                    error: error,
                    callbacks: {
                        400: response=>{
                            this.props.enqueueSnackbar(response.data.message, {variant: "error"});
                        }
                    }
                }, this.props);
            })
            .finally(() => {
                //do nothing
                this.setState({isLoading:false});
            })
    }

    searchHandler = filters =>{
        this.setState({isLoading:true, page: 0})
        makeRequest(this.props).post('/payment/list', qs.stringify(filters))
        .then(response => {
           this.setState({
               rows:response.data.data.list,
               count: response.data.data.count,
               filters
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
            this.setState({isLoading:false});
        })
    }

    updateRow = (data) =>{
        let rows = []
        this.state.rows.forEach(row => {
            if(row.id == data.id){
                rows.push(data)
            }
            else{
                rows.push(row)
            }
        });
        this.setState({rows: rows})
    }

    reload = () =>{
        this.setState({
            isLoading: true,
        })
        this.componentDidMount()
    }

    handleMakePayment = ()=>{
        makeRequest(this.props).post('/payment/add', qs.stringify({policy_no:this.state.policy_no}))
        .then(response => {
            this.props.enqueueSnackbar(response.data.message, {variant: "success"});
            this.reload();
            this.setState({open:false, policy:null})
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

    handleVerify = ()=>{
        this.setState({isLoadingVerify: true})
        makeRequest(this.props).post('/policy/get', qs.stringify({policy_no:this.state.policy_no}))
        .then(response => {
            this.setState({policy: response.data.data.list})
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
            this.setState({isLoadingVerify: false})
        })
    }

    approvePayment = (reference)=>{
        makeRequest(this.props).get('/payment/approve/'+reference)
        .then(response => {
            this.props.enqueueSnackbar(response.data.message, {variant: "success"});
            this.reload();
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

    deletePayment = (reference)=>{
        makeRequest(this.props).get('/payment/delete/'+reference)
        .then(response => {
            this.props.enqueueSnackbar(response.data.message, {variant: "success"});
            this.reload();
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
                title="Customers"
                >
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={this.state.open}
                        onClose={this.onClose}
                    >
                    <DialogTitle>
                        Add Payment
                    </DialogTitle>
                    <Divider style={{marginTop:5,marginBottom:10}}/>
                    <DialogContent className={this.props.classes.dialogContent}>
                        <Grid container spacing={2} style={{marginTop: 20}}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    style={{textTransform:"uppercase"}}
                                    fullWidth
                                    variant="outlined"
                                    label="Policy No"
                                    name="policy_no"
                                    value={this.props.policy_no}
                                    onChange={e => this.setState({policy_no:e.target.value})}
                                />
                            </Grid>
                            {
                                this.state.policy? (
                                    <Box>
                                        <Typography>Policy Name: {this.state.policy.policy.name}</Typography>
                                        <Typography>Name:  {this.state.policy.customer.surname} {this.state.policy.customer.first_name} {this.state.policy.customer.other_name}</Typography>
                                        <Typography>Premium: &#8358;{parseFloat(this.state.policy.premium).toLocaleString()}</Typography>
                                    </Box>
                                ) : (
                                    null
                                )
                            }
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                {
                                    this.state.isLoadingVerify? (
                                        <CircularProgress/>
                                    ) : (
                                        <Button  
                                            style={{marginLeft:10}}
                                            onClick={this.handleVerify}
                                            variant="contained"
                                            color="primary"
                                            disableElevation
                                        >
                                            Verify
                                        </Button>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider style={{marginTop:15,marginBottom:5}}/>
                    <DialogActions>
                        <Button  
                            className={this.props.classes.buttonCancel} 
                            onClick={()=>this.setState({open:false, policy:null})}
                            variant="outlined"
                            disableElevation
                        >
                            Cancel
                        </Button>
                        <Button  
                            style={{marginLeft:10}}
                            onClick={this.handleMakePayment}
                            variant="contained"
                            color="primary"
                            disableElevation
                            disabled={!this.state.policy}
                        >
                            Make Payment
                        </Button>
                    </DialogActions>
                </Dialog>
                <Container maxWidth={false}>
                    <Toolbar openDialog={()=>{this.setState({open:true})}} />
                    <Box mt={3}>
                    <DataLayoutWraper sectionHeading="Customers" searchHandler={this.searchHandler} reloadHandler={this.reload}>
                        <DataViewLoader isLoading={this.state.isLoading} data={this.state.rows}>
                            <TableMaker columns={this.state.columns} page={this.state.page} count={this.state.count} options={this.state.options}>
                                {this.state.rows.map((row, index) => (
                                    <TableRow hover key={row.staff_id}>
                                        <TableCell align="left">
                                            <Box className={this.props.classes.boxOuter}>
                                                <Avatar 
                                                    src={''} 
                                                    className={this.props.classes.avatar}
                                                >
                                                    {getInitials(row.customer.first_name + " " + row.customer.surname)} 
                                                </Avatar>
                                                <Box className={this.props.classes.boxInner}>
                                                    <p className={this.props.classes.name}>{row.customer.surname + " " + row.customer.first_name + " " + row.customer.other_name}</p>
                                                    <p className={this.props.classes.position}>{row.customer.gender}</p>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={this.props.classes.typo}>
                                                {row.policy_no}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={this.props.classes.typo}>
                                                {row.reference}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={this.props.classes.typo}>
                                                {row.amount}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <StatusBadge 
                                                variant={row.status}
                                            > 
                                                {row.status} 
                                            </StatusBadge>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={this.props.classes.typo}>
                                                {row.initialized_by.first_name} {row.initialized_by.last_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={this.props.classes.typo}>
                                                {row.approved_by.first_name} {row.approved_by.last_name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={this.props.classes.typo}>
                                                {row.narration}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={this.props.classes.typo}>
                                                {moment(row.datetime).fromNow()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <PopoverMenu>
                                                <IconMenuItem 
                                                    icon={<CheckIcon color="primary"/>} 
                                                    text="Approve" 
                                                    disabled={row.status!="pending"}
                                                    onClick={evt => this.approvePayment(row.reference)}
                                                />
                                                <IconMenuItem 
                                                    icon={<Delete color="primary"/>} 
                                                    text="Delete"
                                                    disabled={row.status!="pending"} 
                                                    onClick={evt => this.deletePayment(row.reference)}
                                                />
                                                <IconMenuItem 
                                                    icon={<Refresh color="primary"/>} 
                                                    text="Reverse"
                                                    disabled={row.status!="completed"} 
                                                />
                                            </PopoverMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}    
                            </TableMaker>
                        </DataViewLoader>
                    </DataLayoutWraper>
                </Box>
            </Container>
        </Page>
        )
    }
};

const mapStateToProps = (state) => ({
    session_token: state.session_token,
    staffs: state.users,
  })
export default connect(mapStateToProps)(
    withSnackbar(
        withPermission(VIEW_PERMISSION_NAME)(
        withStyles(useStyles)(
            useRouter(Customer)))));