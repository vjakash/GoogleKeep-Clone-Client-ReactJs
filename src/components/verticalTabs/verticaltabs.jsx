import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import NotesTab from '../notesTab/notestab';
import ChecklistTab from '../checklistTab/checklisttab';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div style={{minHeight:'90%'}}>
          {children}
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


export default function VerticalTabs(props) {
    const [value, setValue] = React.useState(0);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            minHeight: '97vh',
        },
        tabs: {
            borderRight: `1px solid  rgba(255, 255, 255, 0.1)`,
            display:props.openHam?'inline-block':'none',
        },tabpanel:{
          width:props.openHam?'85%':'98%',
        }
    }));
    const classes = useStyles();
  return (
    <div className={classes.root}  style={{backgroundColor:"#202124",color:"#fff",marginTop:'10px'}}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="&#x2637; &nbsp; Notes" {...a11yProps(0)} style={{margin:"20px 30px 0px 10px",fontSize:'1em'}} />
        <Tab label="&#x2713;  &nbsp; Checklist" {...a11yProps(1)} style={{margin:"20px 30px 0px 10px",fontSize:'1em'}} />
      </Tabs>
      <TabPanel value={value} index={0} className={classes.tabpanel} >
        <NotesTab signOut={props.signOut} callToast={props.callToast} serverUrl={props.serverUrl} />
      </TabPanel>
      <TabPanel value={value} index={1} className={classes.tabpanel}>
        <ChecklistTab signOut={props.signOut} callToast={props.callToast} serverUrl={props.serverUrl} />
      </TabPanel>
 
    </div>
  );
}
