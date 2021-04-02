/* eslint-disable */
import React from 'react';
import {makeStyles} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

const useStyle = makeStyles({
    
})

const ITEM_HEIGHT = 48;

const PopoverMenu = ({children, menuIconDirection='horizontal', ...props}) =>{

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    const classes = useStyle(props)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
            {menuIconDirection == 'vertical'?(<MoreVertIcon />):(<MoreHorizIcon/>)}
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
        >
          {children}
        </Menu>
      </div>
    )
}


export default PopoverMenu