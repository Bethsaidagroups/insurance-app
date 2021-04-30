/* eslint-disable */
import React, { Component, Fragment } from 'react';
import {
    Box, 
    Avatar, 
    createStyles, 
    withStyles,
    Typography,
    Grid,
    TextField,
    Container,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    TableRow,
    TableCell
} from '@material-ui/core';
import { ListAlt as ListIcon} from '@material-ui/icons'
import { red, grey, deepOrange, green } from '@material-ui/core/colors'
import moment from 'moment'
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux'
import withConfirmationDialog from 'src/utils/confirmationDialog'
import { setReservations, setSales, setFoods, setDrinks} from 'src/actions'
import TableMaker from 'src/components/TableMaker';
import StatusBadge from 'src/components/StatusBadge';


const useStyles = createStyles(theme => ({
    root: {
        backgroundColor: '#fff',
        padding: theme.spacing(2),
    },
    list:{
        marginTop:-20,
    },
    button:{
        justifyContent: "left",
        borderRadius: 0
    },
    avatarCredit:{
        backgroundColor: deepOrange[500],
    },
    listText:{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    },
    primaryText:{
        fontSize: 12,
    },
    secondaryText:{
        fontSize: 11,
    },
    amount:{
        textAlign: "right",
        fontSize: 12,
        fontWeight: 600
    },
    status:{
        textAlign: "right",
        fontSize: 11,
    },
    title:{
        fontWeight: 600,
        marginBottom: 5,
        fontSize: 14,
        width: "50%"
    },
    td:{
        height: 60,
        padding: 3,
        fontSize: 13,
    },
    text:{
        fontSize: 14,
        marginBottom: 5,
        width: "50%",
        borderBottomStyle: "dotted",
        borderBottomWidth: 1,
        padding: 2
    },
    text1:{
        fontSize: 14,
        marginBottom: 5,
        color: grey[800],
        width: "50%",
        borderBottomStyle: "dotted",
        borderBottomWidth: 1,
        padding: 2
    }
}))


class CommissionStatementTemplate extends Component
{
    constructor(props){
        super(props)
        this.state = {
            columns: [
                {label:'Policy No'},
                {label:'Insured'},
                {label:'Commence Date'},
                {label:'Term'},
                {label:'Receipt No'},
                {label:'Reciept Date'},
                {label:'Rate'},
                {label:'Premium'},
                {label:'Comm'},
                {label:'WHT(5%)'},
                {label:'Net Comm.'},
            ],
            rows: [],
            count: 0,
            page: 0,
            options: {
                rowsPerPage: 5,
                onChangePage: this.onChangePage
            }
        }
    }

    getTotal = (list)=>{
        let total_amount = 0;
        let total_commission = 0;
        let total_tax = 0;
        let net_commission = 0;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            total_amount = total_amount + parseFloat(element.payment.payment_amount);
            total_commission = total_commission + parseFloat(element.amount);
            total_tax += this.getWHT(element.amount)
            net_commission += this.getNetComm(element.amount)
            
        }
        return {total_amount, total_commission, total_tax, net_commission}
    }

    getWHT = (amount)=>{
        return parseFloat(amount) * (5/100)
    }

    getNetComm = (amount)=>{
        return parseFloat(amount) - this.getWHT(amount)
    }

    render(){
        return(
            <Container style={{width: "19cm", marginTop:30, padding:10}}>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                    <Box>
                        <Avatar
                            src="/logo-main.png"
                            style={{height: 100, width: 100}}
                            variant="rounded"
                        />
                    </Box>
                    <Box>
                        <Typography style={{color:red[600]}} variant="h2" component="h2">Bethsaida Micro Insurance Limited</Typography>
                        <Typography style={{color:grey[600], fontSize:13}}>Bethsaida Place, 31, Afolabi Aina Street, (Royal Bed Estate)</Typography>
                        <Typography style={{color:grey[600], fontSize:13}}>off Allen Avenue, before new Alade Market, Ikeja Lagos State</Typography>
                        <Typography style={{color:grey[600], fontSize:13}}>Tel: 08053645100</Typography>
                        <Typography style={{color:grey[600], fontSize:13}}>Email: info@bethsaidamicroinsltd.com</Typography>
                    </Box>
                </Box>
                <Divider style={{marginTop:15, marginBottom:15}}/>
                {this.props.list.length > 0 ? (
                    <>
                        <Box display="flex" flexDirection="row" justifyContent="space-between"  style={{backgroundColor:grey[200], padding:10}}>
                            <Box >
                                <Typography style={{color:grey[600], fontSize:12, marginBottom:5}}><strong>Marketer/Agent Name:</strong> {`${this.props.list[0].agent.last_name} ${this.props.list[0].agent.first_name}`}</Typography>
                            </Box>
                            <Box >
                                <Typography style={{color:grey[600], fontSize:12, marginBottom:5}}><strong>Marketer/Agent Code:</strong> {this.props.list[0].agent.agent_code}</Typography>
                                <Typography style={{color:grey[600], fontSize:12, marginBottom:5}}><strong>Date Interval:</strong> {moment(this.props.start_date).format("MMMM Do, YYYY")} - {moment(this.props.end_date).format("MMMM Do, YYYY")}</Typography>
                            </Box>
                        </Box>
                        <Divider style={{marginTop:15, marginBottom:15}}/>
                        <Box>
                            <Typography style={{textAlign:"center", fontSize:13, color:green[700]}}>COMMISSION STATEMENT</Typography>
                        </Box>
                        <Box>
                            <TableMaker columns={this.state.columns} print printComm>
                                {this.props.list ? (
                                    this.props.list.map((row,index)=>(
                                        <TableRow hover key={index}>
                                            <TableCell style={{fontSize:9, minWidth:150, paddingLeft:0}} >{row.payment.policy_no}</TableCell>
                                            <TableCell style={{fontSize:9}} >{row.customer.c_first_name} {row.customer.c_last_name} {row.customer.c_other_name}</TableCell>
                                            <TableCell style={{fontSize:9}} >{moment(row.policy.start_date).format("MMMM Do, YYYY")}</TableCell>
                                            <TableCell style={{fontSize:9}} >{row.policy.period}</TableCell>
                                            <TableCell style={{fontSize:9}} align="left">{row.payment.reference}</TableCell>
                                            <TableCell style={{fontSize:9}} align="left">{moment(row.commission_date).format("MMMM Do, YYYY")}</TableCell>
                                            <TableCell style={{fontSize:9}} align="left">{row.percentage}%</TableCell>
                                            <TableCell style={{fontSize:9}} align="left">{parseFloat(row.payment.payment_amount).toLocaleString({minimumFractionDigits:2})}</TableCell>
                                            <TableCell style={{fontSize:9}} align="left">{parseFloat(row.amount).toLocaleString({minimumFractionDigits:2})}</TableCell>
                                            <TableCell style={{fontSize:9}} align="left">{parseFloat(this.getWHT(row.amount)).toLocaleString({minimumFractionDigits:2})}</TableCell>
                                            <TableCell style={{fontSize:9}} align="left">{parseFloat(this.getNetComm(row.amount)).toLocaleString({minimumFractionDigits:2})}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <Box width="100%" height="250px" justifyContent="center" alignItems="center">
                                        <Typography style={{color:grey[600], fontSize:13}}>No data to display</Typography>
                                    </Box>
                                )}
                            </TableMaker>
                            <Box display="flex" flexDirection="column" justifyContent="right" alignItems="right">
                                <Typography style={{marginTop:20, fontSize:13, fontWeight:700, textAlign:"right"}}>Total Premium: {parseFloat(this.getTotal(this.props.list).total_amount).toLocaleString({minimumFractionDigits:2})}</Typography>
                                <Typography style={{marginTop:20, fontSize:13, fontWeight:700, textAlign:"right"}}>Total Commission: {parseFloat(this.getTotal(this.props.list).total_commission).toLocaleString({minimumFractionDigits:2})}</Typography>
                                <Typography style={{marginTop:20, fontSize:13, fontWeight:700, textAlign:"right"}}>WHT: {parseFloat(this.getTotal(this.props.list).total_tax).toLocaleString({minimumFractionDigits:2})}</Typography>
                                <Typography style={{marginTop:20, fontSize:15, fontWeight:700, textAlign:"right"}}>Net Commission: &#8358;{parseFloat(this.getTotal(this.props.list).net_commission).toLocaleString({minimumFractionDigits:2})}</Typography>
                            </Box>
                        </Box>
                        </>
                    ) : (
                        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
                            <Typography>No Data to display</Typography>
                        </Box>
                    )
                }
                    <Box>
                        <Typography style={{marginTop:10, fontSize:12, color:red[700]}}>
                            *Kindly reconcile the above commission statement. If there is any payment not reflecting
                            above between the date in view, kindly supply us with details of such payment so as to assist us to reconcile your commission statement rightly
                        </Typography>
                    </Box>
            </Container>
        )
    }
}

export default withStyles(useStyles)(CommissionStatementTemplate)