import React, {  useState } from 'react';
import classes from './checkListList.module.css';
import UpdateCheckListDialog from '../updateCheckListDialog/updateCheckListDialoge'
import Spinner from '../spinner/spinner';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {
    withStyles,
  } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
  




  const WhiteCheckbox = withStyles({
    root: {
      color: '#fff',
      '&$checked': {
        color:'#fff',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);
export default function CheckListList(props){
    let initialSelectedNote={
        '_id':'',
        checklist:[],
        newCheckListItem:'',
        owner:'',
        lastUpdatedOn:''
    }
    const [open, setOpen] = useState(false);
    const [deleteLoader,setDeleteLoader]=useState(false);
    const [noteAboutToDelete,setNoteAboutToDelete]=useState('');
    const [selectedNote,setSelectedNote]=useState(initialSelectedNote);

    function openSelectedNote(item){
        setSelectedNote({
            ...item,
            newCheckListItem:'',
        });
        handleOpen();
    }
    const handleOpen = () => {
        setOpen(true);
      };
    const handleClose = () => {
        setOpen(false);
        setSelectedNote(initialSelectedNote);
     };
     
    async function deleteNote(event,id){
        event.stopPropagation();
        // eslint-disable-next-line no-restricted-globals
        let bool=confirm('Do you want to delete?');
        if(bool){
            setNoteAboutToDelete(id);
            console.log(id);
            setDeleteLoader(true);
            let res=await fetch(props.serverUrl+"/deleteChecklist/"+id+"/"+JSON.parse(localStorage.getItem('userData'))['email'],{
                method:'delete',
                headers: {
                    'Content-Type':'application/json',
                    authorization:localStorage.getItem('token')
                }
            }).catch(err=>console.log(err));
            let data=await res.json();
            setDeleteLoader(false);
            if(data['signout']){
                props.callToast('Session expired.Please login again');
                props.signOut();
             }else if(data['message']){
                props.updateNotesList(data['checklists']);
                props.callToast(data['message']);
            }
        }
    }
    
    return (
        <div className={classes.container}>
        {props.notes.map(item=>{
            var options = { month: 'short', day: 'numeric' };
            let itemDate=new Intl.DateTimeFormat('en-us',options).format(new Date(item['lastUpdatedOn']));
            return (
                    (deleteLoader && noteAboutToDelete===item['_id'])?
                    <Paper key={item['_id']} className={classes.paper} elevation={3} style={{'textAlign':'center','backgroundColor': 'rgb(41, 41, 41)', color: 'white',position:'relative', border: '0.1px solid rgba(255, 255, 255, 0.4)'}} >
                        <Spinner/>
                    </Paper>
                    :
                    <Paper key={item['_id']} onClick={()=>openSelectedNote(item)} className={classes.paper} elevation={3} style={{'backgroundColor': 'rgb(41, 41, 41)', color: 'white',position:'relative', border: '0.1px solid rgba(255, 255, 255, 0.4)'}} >
                        {
                            item.checklist.map((checklist,index)=>
                                !checklist.isChecked &&
                                    <ListItem  key={checklist['id']}>
                                        <FormControlLabel 
                                            onChange={handleOpen}
                                            control={<WhiteCheckbox checked={checklist['isChecked']}  name="checkedG" />}
                                            label={<Typography variant="h6" style={{ color: '#fff' }}>{checklist['value']}</Typography>}
                                        />
                                    </ListItem>
                                )
                                
                        }
                        <ListItem>
                            {   item.checklist.filter(item=>item.isChecked).length!==0 && 
                                    <div>
                                        <br/>
                                        <p style={{color:'#fff',fontSize:'1.5em',fontWeight:'600'}}>Checked Item</p>
                                    </div>
                            }
                        </ListItem>
                            {
                                item.checklist.map((checklist,index)=>
                                checklist.isChecked &&
                                            <ListItem key={checklist['id']}>
                                                <FormControlLabel 
                                                    onChange={handleOpen}
                                                    control={<WhiteCheckbox checked={checklist['isChecked']}  name="checkedG" />}
                                                    label={<Typography variant="h6" paragraph style={{ color: '#fff',textDecoration:'line-through',whiteSpace:'pre-wrap' }}>{checklist['value']}</Typography>}
                                                />
                                            </ListItem>           
                                    )
                                }
                        <IconButton onClick={(event)=>deleteNote(event,item['_id'])} aria-label="delete"  style={{position:'absolute',top:'5px',right:'10px'}}>
                            <DeleteIcon fontSize="default" style={{color:'rgba(255, 47, 47, 0.7)'}} />
                        </IconButton>
                        <Divider style={{marginTop:'30px'}} />
                        <ListItem style={{textAlign:'center',width:'100%',padding:'0'}}>
                            <p style={{ color: '#fff',width:'100%',textAlign:'center' }}>Updated {itemDate}</p>
                        </ListItem>
                    </Paper>
                )
        })}
       { open && <UpdateCheckListDialog open={open} serverUrl={props.serverUrl} selectedNote={selectedNote} updateNotesList={props.updateNotesList} handleClose={handleClose} callToast={props.callToast} />}
    </div>
  

    )
}