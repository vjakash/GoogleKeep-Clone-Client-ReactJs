import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HighlightIcon from '@material-ui/icons/Highlight';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor:"#202124"}}>
        <Toolbar>
          <IconButton edge="start" onClick={props.toggleHam} className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} style={{fontSize:"2em"}}>
           <HighlightIcon style={{color:"#FBBC04"}}/> Keep
          </Typography>
          <Button color="inherit" onClick={props.signOut}>Logout &nbsp; <ExitToAppIcon/></Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
