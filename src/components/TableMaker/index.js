/* eslint-disable */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { 
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell, 
    TableBody,
    TablePagination,
    withStyles,
    createStyles} from '@material-ui/core';

    const useStyle = createStyles({
        root:{
            width: '100%'
        },
        container: {
            maxHeight: 500,
        },
        tableHeadCell:{
            minWidth: 200
        },
        tableHeadCellPrint: {
            fontSize: 12,
            minWidth: 150
        },
        tableHeadCellPrintComm: {
            fontSize: 10,
            padding: 0
        }
    })

class TableMaker extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Paper className={this.props.classes.root} elevation={0}>
                {this.props.print ? (
                    <Table>
                    <TableHead>
                        {this.props.print ? (
                            <TableRow>
                                {this.props.columns.map((column, index)=>(
                                    <TableCell
                                        key={'table-header-cell-'+index}
                                        align="left"
                                        className={this.props.printComm ? this.props.classes.tableHeadCellPrintComm : this.props.classes.tableHeadCellPrint}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>  

                        ) : (
                            <TableRow>
                                {this.props.columns.map((column, index)=>(
                                    <TableCell
                                        key={'table-header-cell-'+index}
                                        align={(index == 0)? "left" : "center"}
                                        className={this.props.classes.tableHeadCell}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>  
                        )}      
                    </TableHead>
                    <TableBody>
                        {this.props.children}
                    </TableBody>
                </Table>
                ) : (
                    <TableContainer className={this.props.classes.container}>
                    <Table stickyHeader>
                        <TableHead>
                            {this.props.print ? (
                                <TableRow>
                                    {this.props.columns.map((column, index)=>(
                                        <TableCell
                                            key={'table-header-cell-'+index}
                                            align="left"
                                            className={this.props.printComm ? this.props.classes.tableHeadCellPrintComm : this.props.classes.tableHeadCellPrint}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>  

                            ) : (
                                <TableRow>
                                    {this.props.columns.map((column, index)=>(
                                        <TableCell
                                            key={'table-header-cell-'+index}
                                            align={(index == 0)? "left" : "center"}
                                            className={this.props.classes.tableHeadCell}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>  
                            )}      
                        </TableHead>
                        <TableBody>
                            {this.props.children}
                        </TableBody>
                    </Table>
                </TableContainer>
                )}
                
                {this.props.options &&
                    <TablePagination
                        rowsPerPageOptions={[15]}
                        component="div"
                        count={this.props.count}
                        rowsPerPage={15}
                        page={this.props.page}
                        onChangePage={this.props.options.onChangePage}
                        onChangeRowsPerPage={()=>{}}
                    />
                }
            </Paper>
        )
    }
}

TableMaker.propTypes = {
    children: PropTypes.node,
    columns: PropTypes.array,
    rows: PropTypes.array,
    options: PropTypes.object,
    print: PropTypes.bool
}

export default withStyles(useStyle)(TableMaker)