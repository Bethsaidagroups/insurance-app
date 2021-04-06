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


class ReceiptPrintTemplate extends Component
{
    constructor(props){
        super(props)
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
                        <Typography style={{color:grey[600], fontSize:13}}>Tel: 07065551148</Typography>
                        <Typography style={{color:grey[600], fontSize:13}}>Email: info@bethsaidainsltd.com</Typography>
                    </Box>
                </Box>
                <Divider style={{marginTop:15, marginBottom:15}}/>
                <Box>
                    <Typography style={{textAlign:"center"}}>POLICY SCHEDULE</Typography>
                </Box>
                {
                    this.props.data.policy.var_name == "bta" ? (
                        <Box>
                            <table cellSpacing={0} cellPadding={2} border={1} style={{width: "100%"}}>
                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "40%"}}>Policy Number</td>
                                    <td className={this.props.classes.td} style={{width: "15%"}}>Sum Assured</td>
                                    <td className={this.props.classes.td} style={{width: "25%"}}>Date of Commencement of Assurance</td>
                                    <td className={this.props.classes.td} style={{width: "20%"}}>Date of Proposal and Declaration</td>
                                </tr>
                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "40%"}}><strong>{this.props.data.policy_no}</strong></td>
                                    <td className={this.props.classes.td} style={{width: "15%"}}><strong>&#8358;{parseFloat(JSON.parse(this.props.data.policy_details).sum_assured).toLocaleString()}</strong></td>
                                    <td className={this.props.classes.td} style={{width: "25%"}}><strong>{moment(this.props.data.start_date).format("MMMM Do YYYY")}</strong></td>
                                    <td className={this.props.classes.td} style={{width: "20%"}}><strong>{moment(this.props.data.start_date).format("MMMM Do YYYY")}</strong></td>
                                </tr>
                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "40%"}}> </td>
                                    <td className={this.props.classes.td} style={{width: "15%"}}></td>
                                    <td className={this.props.classes.td} style={{width: "25%"}}>
                                        Age next birthday of the life assured at the date of commencement of insurance
                                    </td>
                                    <td className={this.props.classes.td} style={{width: "20%"}}>{moment(this.props.data.customer.date_of_birth).fromNow(true)}</td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        Name of the Assured: <strong>{this.props.data.customer.surname} {this.props.data.customer.first_name} {this.props.data.customer.other_name}</strong>
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        <table cellSpacing={0} border={1} style={{width: "100%"}}>
                                            <tr style={{width: "100%"}}>
                                                <th>Beneficiary</th>
                                                <th>Percentage</th>
                                                <th>Relationship</th>
                                            </tr>
                                            {
                                                JSON.parse(this.props.data.beneficiary).map((data, index)=>(
                                                    <tr style={{width: "100%"}} key={index}>
                                                        <td className={this.props.classes.td}>{data.full_name}</td>
                                                        <td className={this.props.classes.td}>{data.ppn}%</td>
                                                        <td className={this.props.classes.td}>{data.relationship}</td>
                                                    </tr>
                                                ))
                                            }
                                        </table>
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        <strong>Adress</strong>: {this.props.data.customer.address}
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}></td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        Occupation of the Life Assured
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>{this.props.data.customer.occupation}</td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        <p>Premium: <strong>&#8358;{parseFloat(this.props.data.premium).toLocaleString()}</strong></p>
                                        <p>Extra Premium: <strong>&#8358;0.00</strong></p>
                                        <p>Total: <strong>&#8358;{parseFloat(this.props.data.premium).toLocaleString()}</strong></p>
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        Event upon the happening of which the sum Assured is to become Payable
                                        UPON THE DEATH OF THE LIFE ASSURED
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        Provided always that no premuim shall fall due after the death of the life assured
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}></td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} colSpan={4} style={{width: "100%"}}>
                                        SPECIAL PROVISIONS
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} colSpan={4} style={{width: "100%"}}>
                                        SUM ASSURED: The Sum Assured shall be without participation in profits and shall be as follows for the period of 
                                        <strong>{this.props.data.period} Year(s)</strong> commencing on <strong>{moment(this.props.data.start_date).format("MMMM Do YYYY")}</strong>
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        EXPIRY DATE
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        {moment(this.props.data.start_date).add(parseInt(this.props.data.period),"years").format("MMMM Do YYYY")}
                                    </td>
                                </tr>
                            </table>
                        </Box>
                    ) : (
                        <Box>
                            <table cellSpacing={0} cellPadding={2} border={1} style={{width: "100%"}}>
                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} colSpan={4} style={{width: "100%"}}>
                                        POLICY NUMBER: <strong>{this.props.data.policy_no}</strong>
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        COMMENCEMENT DATE: {moment(this.props.data.start_date).format("MMMM Do YYYY")}
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        MATURITY DATE: {moment(this.props.data.start_date).add(parseInt(this.props.data.period),"years").format("MMMM Do YYYY")}
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        FULL NAME & ADDRESS OF LIFE ASSURED:
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        <p><strong>{this.props.data.customer.surname} {this.props.data.customer.first_name} {this.props.data.customer.other_name}</strong></p>
                                        <p>{this.props.data.customer.address}</p>
                                    </td>
                                </tr>
                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        DATE OF BIRTH
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        {moment(this.props.data.customer.date_of_birth).format("MMMM Do YYYY")}
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        TYPE OF ASSURANCE
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        {this.props.data.policy.name}
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        SUM ASSURED
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        &#8358;{parseFloat(JSON.parse(this.props.data.policy_details).sum_assured).toLocaleString()}
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        DURATION
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        {this.props.data.period} Years
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        TO WHOM BENEFITS ARE PAYABLE
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                       See General Condition
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} style={{width: "50%"}}>
                                        AMOUNT OF PREMIUM AND FREQUENCY OF PREMIUM PAYMENT
                                    </td>
                                    <td className={this.props.classes.td} colSpan={3}>
                                        <table cellSpacing={0} cellPadding={2} border={1} style={{width: "100%"}}>
                                            <tr>
                                                <th></th>
                                                <th className={this.props.classes.td}>MAIN</th>
                                                <th className={this.props.classes.td}>SUPPLEMENTARY</th>
                                                <th></th>
                                            </tr>

                                            <tr>
                                                <th className={this.props.classes.td}>BASIC</th>
                                                <td className={this.props.classes.td}>&#8358;{parseFloat(this.props.data.premium).toLocaleString()}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <th className={this.props.classes.td}>EXTRA</th>
                                                <td className={this.props.classes.td}>&#8358;0.00</td>
                                                <td></td>
                                                <td></td>
                                            </tr>

                                            <tr>
                                                <th className={this.props.classes.td}>TOTAL</th>
                                                <td className={this.props.classes.td}>&#8358;{parseFloat(this.props.data.premium).toLocaleString()}</td>
                                                <td></td>
                                                <td className={this.props.classes.td}>Monthly</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr style={{minHeight: 60}}>
                                    <td className={this.props.classes.td} colSpan={4} style={{width: "100%"}}>
                                        SEE GENERAL CONDITIONS
                                    </td>
                                </tr>
                            </table>
                        </Box>
                    )
                }
            </Container>
        )
    }
}

export default withStyles(useStyles)(ReceiptPrintTemplate)