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
} from '@material-ui/core';
import { ListAlt as ListIcon} from '@material-ui/icons'
import { orange, red, grey, deepOrange, green } from '@material-ui/core/colors'
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


class ReceiptPrintTemplate extends Component
{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Container style={{width: "17cm", padding:10, borderStyle: "solid", borderWidth: 1, borderRadius: 5}}>
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
                        <Typography style={{color:grey[600], fontSize:13}}>Tel: 07065551148</Typography>
                        <Typography style={{color:grey[600], fontSize:13}}>Email: info@bethsaidainsltd.com</Typography>
                    </Box>
                </Box>
                <Divider style={{marginTop:15, marginBottom:15}}/>
                <Box>
                    <Box style={{marginTop: 20}}>
                        <Box display="flex" fexDireection="column" justifyContent="space-between" style={{marginBottom: 5}}>
                            <Typography className={this.props.classes.title}>Receive with thanks from: </Typography>
                            <Typography className={this.props.classes.text}>Akosile Opeyemi Samuel</Typography>
                        </Box>

                        <Box display="flex" fexDireection="column" justifyContent="space-between" style={{marginBottom: 5}}>
                            <Typography className={this.props.classes.title}>Policy/Item: </Typography>
                            <Typography className={this.props.classes.text}>ISP/676787/JSH</Typography>
                        </Box>

                        <Box display="flex" fexDireection="column" justifyContent="space-between" style={{marginBottom: 5}}>
                            <Typography className={this.props.classes.title}>Date: </Typography>
                            <Typography className={this.props.classes.text}>January 12, 2021</Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider style={{marginTop:10, marginBottom:10}}/>
                <Typography variant="h6" component="h6" style={{textAlign:"center"}}>Official Receipt (No: R6788-J78)</Typography>
                <Divider style={{marginTop:10, marginBottom:10}}/>
                <Box>
                    <Box spacing={2} style={{marginTop: 20}}>
                        <Box display="flex" fexDireection="column" justifyContent="space-between" style={{marginBottom: 5}}>
                            <Typography className={this.props.classes.title}>Agency/Source: </Typography>
                            <Typography className={this.props.classes.text1}>Dave Hope - BMG/4061</Typography>
                        </Box>

                        <Box display="flex" fexDireection="column" justifyContent="space-between" style={{marginBottom: 5}}>
                            <Typography className={this.props.classes.title}>The Sum of: </Typography>
                            <Typography className={this.props.classes.text1}>&#8358;25,000.00 Naira</Typography>
                        </Box>

                        <Box display="flex" fexDireection="column" justifyContent="space-between" style={{marginBottom: 5}}>
                            <Typography className={this.props.classes.title}>Payment in Respect of: </Typography>
                            <Typography className={this.props.classes.text1}>Premium Received (Pol. ISP/676787/JSH)</Typography>
                        </Box>

                        <Box display="flex" fexDireection="column" justifyContent="space-between" style={{marginBottom: 5}}>
                            <Typography className={this.props.classes.title}>Cash/Cheque/Narration: </Typography>
                            <Typography className={this.props.classes.text1}>cash, Payment with reference - 8937930028</Typography>
                        </Box>

                        <Box display="flex" fexDireection="column" justifyContent="space-between" style={{marginBottom: 5}}>
                            <Typography className={this.props.classes.title}>Teller No: </Typography>
                            <Typography className={this.props.classes.text1}>Akosile Opeyemi</Typography>
                        </Box>
                    </Box>
                </Box>
                <Typography style={{textAlign: "center", fontSize: 11, color: green[500], marginTop:15}}>
                        This Receipt was generated by Bethsaida Micro Insuarance Limited system and may be 
                        considered as an evidence of a completed transaction
                </Typography>
            </Container>
        )
    }
}

export default withStyles(useStyles)(ReceiptPrintTemplate)