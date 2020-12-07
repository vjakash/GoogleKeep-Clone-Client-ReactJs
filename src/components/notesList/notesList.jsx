import React, { useState } from 'react';
import classes from './notesList.module.css';
import Spinner from '../spinner/spinner';
import Paper from '@material-ui/core/Paper';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    withStyles,
    makeStyles,
  } from '@material-ui/core/styles';
  

const CssTextField = withStyles({
    root: { 
        '& .MuiInputBase-root': {
            color: 'white',
          },
        '& label':{
            color:'white'
        },
        '& .MuiInput-underline':{
            color:'white'
        },
      '& label.Mui-focused': {
        color: 'white',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
          color:'white'
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
        },
      },
    },
  })(TextField);

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor:'rgb(61, 61, 61)',
    //   width:'30%',
    //   border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    margin: {
      margin: theme.spacing(1),
    },
  }));

export default function NotesList(props){
    const MaterialClasses = useStyles();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteLoader,setDeleteLoader]=useState(false);
    const [noteAboutToDelete,setNoteAboutToDelete]=useState('');
    const [validate, setValidate] = useState(false);
    const [selectedNote,setSelectedNote]=useState({
        '_id':'',
        title:'',
        note:'',
        owner:'',
        lastUpdatedOn:''
    });
    function handleNewNote(event){
        let name=event.target.name;
        let value=event.target.value;
        setSelectedNote((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        });
    }
    async function updateNote(){
        setValidate(true);
        if(selectedNote.title!=='' && selectedNote.note!==''){
            setLoading(true);
            let res=await fetch(props.serverUrl+"/updateNote",{
                method:'put',
                headers: {
                    'Content-Type':'application/json',
                    authorization:localStorage.getItem('token')
                },
                body:JSON.stringify(selectedNote),
            }).catch(err=>console.log(err));
            let data=await res.json();
            setLoading(false);
            if(data['signout']){
                props.callToast('Session expired.Please login again');
                props.signOut();
             }else if(data['message']){
                handleClose();
                props.updateNotesList(data['notes']);
                props.callToast(data['message']);
            }
        }
    }
    function openSelectedNote(item){
        setSelectedNote(item);
        handleOpen();
    }
    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        setValidate(false);
        setSelectedNote({});
      };

    let noteStyle={
        title:{
            fontSize:'1.5em',
            fontWeight:'bold',
        },
        note:{
            fontSize:'1.2em',
            whiteSpace:'pre-line'
        }
    }
    async function deleteNote(event,id){
        event.stopPropagation();
        // eslint-disable-next-line no-restricted-globals
        let bool=confirm('Do you want to delete?');
        if(bool){
            setNoteAboutToDelete(id);
            console.log(id);
            setDeleteLoader(true);
            let res=await fetch(props.serverUrl+"/deleteNote/"+id+"/"+JSON.parse(localStorage.getItem('userData'))['email'],{
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
                props.updateNotesList(data['notes']);
                props.callToast(data['message']);
            }
        }
    }
    return (
        <div className={classes.container}>
        {props.notes.map(item=>{
            return (
                    (deleteLoader && noteAboutToDelete===item['_id'])?
                    <Paper key={item['_id']} className={classes.paper} elevation={3} style={{'textAlign':'center','backgroundColor': 'rgb(41, 41, 41)', color: 'white',position:'relative', border: '0.1px solid rgba(255, 255, 255, 0.4)'}} >
                        <Spinner/>
                    </Paper>
                    :
                    <Paper key={item['_id']} onClick={()=>openSelectedNote(item)} className={classes.paper} elevation={3} style={{'backgroundColor': 'rgb(41, 41, 41)', color: 'white',position:'relative', border: '0.1px solid rgba(255, 255, 255, 0.4)'}} >
                        <span style={noteStyle.title}>{item['title']}</span>
                        <br/>
                        <br/>
                        <span style={noteStyle.note}>{item['note']}</span>
                        <IconButton onClick={(event)=>deleteNote(event,item['_id'])} aria-label="delete" className={classes.deleteButton} style={{position:'absolute',top:'5px',right:'10px'}}>
                            <DeleteIcon fontSize="default" />
                        </IconButton>
                    </Paper>
                )
        })}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={MaterialClasses.modal}
                open={open}
                // onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
        >
                <Fade in={open}>
                    <div className={`${MaterialClasses.paper} ${classes.modelBody}`}>
                        <CssTextField  error={selectedNote.title==='' && validate?true:false} onChange={handleNewNote} name="title" value={selectedNote.title} fullWidth className={MaterialClasses.margin} id="custom-css-standard-input" label="Title" />
                        <br/>
                        <br/>
                        <CssTextField
                            error={selectedNote.note==='' && validate?true:false}
                            onChange={handleNewNote}
                            name="note"
                            value={selectedNote.note}
                            id="custom-css-outlined-textarea"
                            label="Enter your notes"
                            placeholder=""
                            multiline
                            fullWidth
                            rows={8}
                            variant="outlined"
                        />
                        {
                            loading?
                            <div style={{textAlign:'right'}}>
                                <Spinner/>
                            </div>
                                :
                            <div style={{textAlign:'right'}}>
                                <br/>
                                <Button variant="contained" onClick={handleClose}>Cancel</Button> &nbsp;&nbsp;
                                <br className={classes.mediaBreak}/>
                                <br className={classes.mediaBreak}/>
                                <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={updateNote} >
                                    Update
                                </Button> &nbsp;&nbsp;
                            </div>
                        }
                        
                    </div>
                </Fade>
            </Modal>
        </div>
  

    )
}