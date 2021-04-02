/* eslint-disable */
import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Book,
  Briefcase,
  Users,
  UserCheck,
  Clock
} from 'react-feather';
import NavItem from './NavItem';
import {connect} from 'react-redux'

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/staffs',
    icon: UserCheck,
    title: 'Staffs'
  },
  {
    href: '/app/agents',
    icon: Briefcase,
    title: 'Agents'
  },
  {
    href: '/app/customers',
    icon: Users,
    title: 'Customers'
  },
  {
    href: '/app/policies',
    icon: Book,
    title: 'Policies'
  },
  {
    href: '/app/payments',
    icon: Clock,
    title: 'Payments'
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile, user }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  let user_info = null
  if (user){
    user_info = user
  }
  else{
    user_info = {first_name:"Guest",Last_name:"Guest", account_type:"Not Set"}
  }

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src="/static/images/avatars/Avatar.webp"
          to=""
        />
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {user_info.first_name} {user_info.last_name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user_info.position}
        </Typography>
        <Button variant="contained" color="primary" onClick={evt=>navigate('/app/pwd-update')}>Change Password</Button>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} /> 
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

const mapStateToProps = (state) => ({
  user: state.user
})

export default connect(mapStateToProps)(NavBar);
