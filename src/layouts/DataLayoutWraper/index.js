/* eslint-disable */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { 
  Card, 
  CardContent, 
  IconButton, 
  CardHeader, 
  Divider,
  Tooltip,
  Paper,
  InputBase,
  TextField,
  Badge, 
  Popover,
  createStyles, 
  withStyles, 
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  MenuItem,
  Chip} from '@material-ui/core';
import { 
  PrintRounded as PrintIcon, 
  CloudDownloadRounded as DownloadIcon, 
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Cancel as ClearIcon,
  CheckCircle as CheckIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessIcon,
  Money as MoneyIcon,
  Equalizer as StatusIcon,
  People as BiodataIcon,
  Map as MapIcon,
  PinDrop as MapPinIcon,
  Sync as ReloadIcon,
  PieChart
} from '@material-ui/icons'
import IconMenuItem from 'src/components/IconMenuItem'
import PopoverMenu from 'src/components/PopoverMenu'

import DateFnsUtils from '@date-io/date-fns';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import {connect} from 'react-redux'

const useStyles = createStyles(theme =>({
  paperRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    [theme.breakpoints.down("md")]:{
      width: "100%",
    }
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 30,
    margin: 4,
  },
  popoverBox:{
    width: 500,
    height:"50vh",
    overflowY: "scroll",
    [theme.breakpoints.down("md")]:{
      width: 400,
      height: "50vh"
    },
    padding:10,
  },
  button:{
    marginRight: 5,
  },
  subHeadTitle:{
    marginBottom: 10
  },
  formControl:{
    marginTop: 15,
  },
  statusTextfield:{
    marginTop: "-5px",
  },
  chip:{
    margin: 3
  }
}))
const statusValue = [
  {key:0, value:"active", label:"Active"},
  {key:1, value:"inactive", label:"Inactive"},
  {key:2, value:"pending", label:"Pending"},
  {key:3, value:"completed", label:"Completed"},
  {key:4, value:"declined", label:"Declined"},
]
class DataLayoutWrapper extends Component {

  constructor(props){
    super(props)
    this.state = {
      filterCount: 0,
      anchorEl: null,
      filters:{
        keyword: "",
        startDate: null,
        endDate: null,
        minAmount: null,
        maxAmount: null,
        gender: null,
        transaction_type: null,
        status:[],
      },
      lastAddedStatus: "",
      chipData: [],
      lastAddedLocation: "",
      officeChipData: []
    }
  }

  handleStartDateChange = (date)=>{
    if(this.state.filters.startDate){
      if(!date){
        this.setState({filterCount: this.state.filterCount - 1})
      }
    }
    if(date && (!this.state.filters.startDate)){
      this.setState({filterCount: this.state.filterCount + 1})
    }
    this.setState({filters: Object.assign({},this.state.filters,{startDate:date})})
  }

  handleEndDateChange = (date)=>{
    if(this.state.filters.endDate){
      if(!date){
        this.setState({filterCount: this.state.filterCount - 1})
      }
    }
    if(date && (!this.state.filters.endDate)){
      this.setState({filterCount: this.state.filterCount + 1})
    }
    this.setState({filters: Object.assign({},this.state.filters,{endDate:date})})
  }

  handleInputChange = (event) => {
    if(event.target.name === 'minAmount'){
      if(this.state.filters.minAmount){
        if(!event.target.value){
          this.setState({filterCount: this.state.filterCount - 1})
        }
      }
      if(event.target.value){
        if(!this.state.filters.minAmount){
          this.setState({filterCount: this.state.filterCount + 1})
        }
        else if(this.state.filters.minAmount.length === 0){
          this.setState({filterCount: this.state.filterCount + 1})
        }
      }
    }
    else if(event.target.name === 'maxAmount'){
      if(this.state.filters.maxAmount){
        if(!event.target.value){
          this.setState({filterCount: this.state.filterCount - 1})
        }
      }
      if(event.target.value){
        if(!this.state.filters.maxAmount){
          this.setState({filterCount: this.state.filterCount + 1})
        }
        else if(this.state.filters.maxAmount.length === 0){
          this.setState({filterCount: this.state.filterCount + 1})
        }
      }
    }
    this.setState({filters: Object.assign({},this.state.filters,{[event.target.name]:event.target.value})})
  }

  handelStatusAdd = (evt) =>{
    let hasValue = false
    for (let i = 0; i < this.state.chipData.length; i++) {
      if(statusValue[evt.target.value].value === this.state.chipData[i].value){
        hasValue = true
      }  
    }
    if(!hasValue){
      this.setState({filterCount: this.state.filterCount + 1})
      let chipData = this.state.chipData
      let selectedStatus = this.state.filters.status
      selectedStatus.push(statusValue[evt.target.value].value)
      chipData.push(statusValue[evt.target.value])
      this.setState({
        chipData,
        lastAddedStatus: "",
        filters: Object.assign({},this.state.filters,{status:selectedStatus})
      })
    }
  }

  handleStatusRemove = (index) =>{
    this.setState({filterCount: this.state.filterCount - 1})
    let updatedChipData = []
    let selectedStatus = []
    for (let i = 0; i < this.state.chipData.length; i++) {
      if(index !== i){
        updatedChipData.push(this.state.chipData[i])
        selectedStatus.push(this.state.chipData[i].value)
      }  
    }
    this.setState({
      chipData:updatedChipData,
      filters: Object.assign({},this.state.filters,{status:selectedStatus})
    })
  }

  handelOfficeLocationAdd = (evt) =>{
    let hasValue = false
    for (let i = 0; i < this.state.officeChipData.length; i++) {
      if(evt.target.value === this.state.officeChipData[i].id){
        hasValue = true
      }  
    }
    if(!hasValue){
      this.setState({filterCount: this.state.filterCount + 1})
      let chipData = this.state.officeChipData
      let selectedOffice = this.state.filters.office_location
      selectedOffice.push(evt.target.value)
      for (let index = 0; index < this.props.user_office_location.length; index++) {
        if(this.props.user_office_location[index].office.id === evt.target.value){
          chipData.push(this.props.user_office_location[index].office)
        }
      }
      this.setState({
        officeChipData: chipData,
        lastAddedOffice: "",
        filters: Object.assign({},this.state.filters,{office_location: selectedOffice})
      })
    }
  }

  handleOfficeLocationRemove = (index) =>{
    this.setState({filterCount: this.state.filterCount - 1})
    let updatedChipData = []
    let selectedOffice = []
    for (let i = 0; i < this.state.officeChipData.length; i++) {
      if(index !== i){
        updatedChipData.push(this.state.officeChipData[i])
        selectedOffice.push(this.state.officeChipData[i].id)
      }  
    }
    this.setState({
      officeChipData:updatedChipData,
      filters: Object.assign({},this.state.filters,{office_location:selectedOffice})
    })
  }

  handleClearFilter = (evt) =>{
    this.setState({
      filters: {
        keyword: "",
        startDate: null,
        endDate: null,
        minAmount: "",
        maxAmount: "",
        transaction_type: "",
        status: [],
      },
      chipData: [],
      officeChipData: [],
      filterCount: 0,
    })
  }

  handleApplyFilter = (evt) =>{
    this.setState({anchorEl:null})
  }

  handleKeywordChange = evt =>{
    if(this.state.filters.keyword){
      if(!evt.target.value){
        this.setState({filterCount: this.state.filterCount - 1})
      }
    }
    if(evt.target.value){
      if(!this.state.filters.keyword){
        this.setState({filterCount: this.state.filterCount + 1})
      }
      else if(this.state.filters.keyword.length === 0){
        this.setState({filterCount: this.state.filterCount + 1})
      }
    }
    this.setState({filters: Object.assign({},this.state.filters,{keyword:evt.target.value})})
  }

  handelFieldChange = evt =>{
    if(!this.state.filters[evt.target.name]){
      this.setState({filterCount: this.state.filterCount + 1})
    }
    this.setState({filters: Object.assign({},this.state.filters,{[evt.target.name]:evt.target.value})})
  }

  reloadHandler = event => {
    this.handleClearFilter()
    this.props.reloadHandler()
  }

  render() {
    return (
      <Card  elevation={0} variant="outlined">
        <CardHeader 
          title={this.props.sectionHeading}
          action={
            <Fragment>
                <Paper component="form" className={this.props.classes.paperRoot} elevation={0} variant="outlined">
                <IconButton 
                    className={this.props.classes.iconButton} 
                    aria-label="filter" 
                    color="primary"
                    onClick={evt => {this.setState({anchorEl:evt.currentTarget})}}
                  >
                    <Badge badgeContent={this.state.filterCount} color="error">
                      <FilterListIcon />
                    </Badge>
                  </IconButton>
                  <Popover
                    id={ Boolean(this.state.anchorEl) ? "simple-popover" : undefined}
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    onClose={evt => this.setState({anchorEl:null})}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Card className={this.props.classes.popoverBox}>
                      <CardHeader
                        title={<Typography><FilterListIcon /> Filter Search</Typography>}
                        action={
                          <div>
                            <Button
                              startIcon={<ClearIcon fontSize="medium"/>}
                              size="small"
                              className={this.props.classes.button}
                              variant="outlined"
                              color="default"
                              onClick={this.handleClearFilter}
                            >
                              Clear
                            </Button>
                            
                            <Button
                              startIcon={<CheckIcon fontSize="medium"/>}
                              size="small"
                              className={this.props.classes.button}
                              variant="outlined"
                              color="secondary"
                              onClick={this.handleApplyFilter}
                            >
                              Apply
                            </Button>
                          </div>
                        }
                      />
                      
                      <Divider />
                      <CardContent>

                        {/** DATE INTERVAL QUERY */}
                        <Typography component="h6" className={this.props.classes.subHeadTitle}><CalendarIcon /> Add Date Interval </Typography>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <Grid
                            container
                            spacing={2}
                            justify="space-between"
                          >
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                              <KeyboardDatePicker
                                  margin="normal"
                                  id="date-picker-dialog-start"
                                  label="From"
                                  format="dd/MM/yyyy"
                                  value={this.state.filters.startDate}
                                  onChange={this.handleStartDateChange}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                              <KeyboardDatePicker
                                  margin="normal"
                                  id="date-picker-dialog-end"
                                  label="To"
                                  format="dd/MM/yyyy"
                                  name="endDate"
                                  value={this.state.filters.endDate}
                                  onChange={this.handleEndDateChange}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                  }}
                                />
                            </Grid>
                          </Grid>
                        </MuiPickersUtilsProvider>

                        {/** AMOUNT RANGE QUERY */}
                        <Divider style={{marginBottom:10, marginTop:10}}/>
                        <Typography component="h6" className={this.props.classes.subHeadTitle}><MoneyIcon /> Add Amount Range </Typography>
                        <Grid
                            container
                            spacing={2}
                            justify="space-between"
                          >
                             <Grid item xs={6} sm={6} md={6} lg={6}>
                              <FormControl fullWidth variant="outlined" className={this.props.classes.formControl}>
                                <InputLabel htmlFor="outlined-adornment-amount-min">Minimum Amount</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-amount-min"
                                  value={this.state.filters.minAmount}
                                  name="minAmount"
                                  onChange={this.handleInputChange}
                                  startAdornment={<InputAdornment position="start">&#8358;</InputAdornment>}
                                  labelWidth={115}
                                />
                              </FormControl>
                             </Grid>
                             <Grid item xs={6} sm={6} md={6} lg={6}>
                              <FormControl fullWidth variant="outlined" className={this.props.classes.formControl}>
                                <InputLabel htmlFor="outlined-adornment-amount-max">Maximum Amount</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-amount-max"
                                  value={this.state.filters.maxAmount}
                                  name="maxAmount"
                                  onChange={this.handleInputChange}
                                  startAdornment={<InputAdornment position="start">&#8358;</InputAdornment>}
                                  labelWidth={115}
                                />
                              </FormControl>
                             </Grid>
                          </Grid>

                          {/** TRANSACTION QUERY */}
                          <Divider style={{marginBottom:10, marginTop:10}}/>
                          <Typography component="h6" className={this.props.classes.subHeadTitle}><BiodataIcon /> Add Transaction Variable </Typography>
                          <Grid
                            container
                            spacing={2}
                            justify="space-between"
                          >
                             <Grid item xs={6} sm={6} md={6} lg={6}>
                                  <TextField
                                    className={this.props.classes.statusTextfield}
                                    variant="outlined"
                                    label="Add Transaction Type"
                                    select
                                    fullWidth
                                    name="transaction_type"
                                    value={this.state.filters.transaction_type}
                                    onChange={this.handelFieldChange}
                                  >
                                   <MenuItem value="debit">Debit</MenuItem>
                                   <MenuItem value="credit">Credit</MenuItem>
                                  </TextField>
                              </Grid>
                          </Grid>

                          {/** BIODATA QUERY */}
                          <Divider style={{marginBottom:10, marginTop:10}}/>
                          <Typography component="h6" className={this.props.classes.subHeadTitle}><BiodataIcon /> Add Biodata Variable </Typography>
                          <Grid
                            container
                            spacing={2}
                            justify="space-between"
                          >
                             <Grid item xs={6} sm={6} md={6} lg={6}>
                                  <TextField
                                    className={this.props.classes.statusTextfield}
                                    variant="outlined"
                                    label="Add Gender"
                                    select
                                    fullWidth
                                    name="gender"
                                    value={this.state.filters.gender}
                                    onChange={this.handelFieldChange}
                                  >
                                   <MenuItem value="male">Male</MenuItem>
                                   <MenuItem value="female">Female</MenuItem>
                                  </TextField>
                              </Grid>
                          </Grid>

                          {/** STATUS QUERY */}
                          <Divider style={{marginBottom:10, marginTop:10}}/>
                          <Typography component="h6" className={this.props.classes.subHeadTitle}><StatusIcon /> Add Status Variable </Typography>
                          <Grid
                            container
                            spacing={2}
                            justify="space-between"
                          >
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                {
                                  this.state.chipData.map((data,index)=>(
                                    <Chip
                                      className={this.props.classes.chip}
                                      color="secondary"
                                      variant="outlined"
                                      size="small"
                                      icon={<AccessIcon />}
                                      label={data.label}
                                      onDelete={evt =>{this.handleStatusRemove(index)}}
                                    />
                                  ))
                                }
                            </Grid>
                             <Grid item xs={6} sm={6} md={6} lg={6}>
                                  <TextField
                                    className={this.props.classes.statusTextfield}
                                    variant="outlined"
                                    label="Add Status"
                                    select
                                    fullWidth
                                    value={this.state.lastAddedStatus}
                                    onChange={this.handelStatusAdd}
                                  >
                                    {
                                      statusValue.map((status, index) =>(
                                      <MenuItem key={status.key} value={index}>{status.label}</MenuItem>
                                      ))
                                    }
                                  </TextField>
                              </Grid>
                          </Grid>
                      </CardContent>
                    </Card>
                  </Popover>
                  <InputBase
                    className={this.props.classes.input}
                    placeholder="Search keywords"
                    inputProps={{ 'aria-label': 'search data' }}
                    value={this.state.filters.keyword}
                    onChange={this.handleKeywordChange}
                  />
                  <IconButton 
                    className={this.props.classes.iconButton} 
                    aria-label="search" 
                    onClick={evt => {this.props.searchHandler(this.state.filters)}}
                    disabled={!(this.state.filters.keyword || (this.state.filterCount > 0))}
                    color="primary"
                  >
                    <SearchIcon/>
                  </IconButton>
                  <Divider className={this.props.classes.divider} orientation="vertical" />
                  <PopoverMenu menuIconDirection="vertical">
                    <IconMenuItem icon={<PieChart color="primary"/>} text="View Report" onClick={this.props.openReportDialog}/>
                    <IconMenuItem icon={<DownloadIcon color="primary"/>} text="Download CSV" />                  
                  </PopoverMenu>
                  <Divider className={this.props.classes.divider} orientation="vertical" />
                  <IconButton 
                    className={this.props.classes.iconButton} 
                    aria-label="search" 
                    onClick={this.reloadHandler}
                    disabled={!(this.props.reloadHandler)}
                    color="primary"
                  >
                    <ReloadIcon/>
                  </IconButton>
                </Paper>
            </Fragment>
          }
        > 
        </CardHeader>
        <Divider/>
        <CardContent className="p-3">{this.props.children}</CardContent>
      </Card>
    );
  }
}

DataLayoutWrapper.propTypes = {
  searchHandler: PropTypes.func.isRequired,
  reloadHandler: PropTypes.func.isRequired
}

export default withStyles(useStyles)(DataLayoutWrapper)