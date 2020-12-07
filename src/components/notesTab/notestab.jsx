import React, { useState,useEffect } from 'react';
import classes from './notestab.module.css';
import Spinner from '../spinner/spinner';
import NotesList from '../notesList/notesList';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

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


export default function NotesTab(props){
    let initialNewNoteValue={
        title:'',
        note:'',
        owner:JSON.parse(localStorage.getItem('userData'))['email']
    }
    const MaterialClasses = useStyles();
    const [constructorHasRun, setConstructorHasRun] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [notes,SetNotes] = useState([]);
    const [validateNewNote, setValidateNewNote] = useState(false);
    const [newNote,setNewNote]=useState(initialNewNoteValue);
    async function loadNotes(){
            if (!constructorHasRun){
            let owner=JSON.parse(localStorage.getItem('userData'))['email'];
            setLoadingNotes(true);
            let res=await fetch(props.serverUrl+"/getNotes/"+owner,{
                method:'get',
                headers: {
                    'Content-Type':'application/json',
                    authorization:localStorage.getItem('token')
                }
            }).catch(err=>console.log(err));
            let data=await res.json();
            setLoadingNotes(false);
            if(data['signout']){
                props.callToast('Session expired.Please login again');
               props.signOut();
            }else{
                updateNotesList(data['notes']);
                console.log(data['notes']);
            }
        }
    }
    function updateNotesList(notes){
        SetNotes(notes);
    }
    useEffect(() => {
        if (!constructorHasRun){
            loadNotes();
            setConstructorHasRun(true);
        }
    },[]);
    function handleNewNote(event){
        let name=event.target.name;
        let value=event.target.value;
        setNewNote((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        });
    }
    async function addNewNote(){
        setValidateNewNote(true);
        if(newNote.title!=='' && newNote.note!==''){
            setLoading(true);
            let res=await fetch(props.serverUrl+"/addNotes",{
                method:'post',
                headers: {
                    'Content-Type':'application/json',
                    authorization:localStorage.getItem('token')
                },
                body:JSON.stringify(newNote),
            }).catch(err=>console.log(err));
            let data=await res.json();
            setLoading(false);
            if(data['signout']){
                props.callToast('Session expired.Please login again');
                props.signOut();
             }else if(data['message']){
                handleClose();
                SetNotes(data['notes']);
                props.callToast(data['message']);
            }
        }
    }

    const handleOpen = () => {
      setOpen(true);
     
    };
  
    const handleClose = () => {
      setOpen(false);
      setValidateNewNote(false);
      setNewNote(initialNewNoteValue);
    };
    
    return (
        <div className={classes.container}>
            {(notes.length===0 && !loadingNotes) && <div style={{textAlign:'center',marginTop:'50px'}}><p>No notes available</p></div>}
            {loadingNotes?<div style={{textAlign:'center',marginTop:'50px'}}><Spinner /></div>:<NotesList signOut={props.signOut} callToast={props.callToast} serverUrl={props.serverUrl} updateNotesList={updateNotesList} notes={notes} />}
            <Fab onClick={handleOpen} style={{backgroundColor:'#fdd835',right:'30px',bottom:'30px',position:'fixed'}} aria-label="add">
                <AddIcon />
            </Fab>
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
                        <CssTextField  error={newNote.title==='' && validateNewNote?true:false} onChange={handleNewNote} name="title" value={newNote.title} fullWidth className={MaterialClasses.margin} id="custom-css-standard-input" label="Title" />
                        <br/>
                        <br/>
                        <CssTextField
                            error={newNote.note==='' && validateNewNote?true:false}
                            onChange={handleNewNote}
                            name="note"
                            value={newNote.note}
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
                                <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={addNewNote}> 
                                    Save
                                </Button> &nbsp;&nbsp;
                            </div>
                        }
                        
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}