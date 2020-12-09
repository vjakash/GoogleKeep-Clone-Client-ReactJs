import React, { useState,useEffect } from 'react';
import classes from './checklisttab.module.css';
import Spinner from '../spinner/spinner';
import CheckListList from '../checkListList/checkListList';
import FullScreenDialog from '../fullScreenDialoge/fullScreenDialoge';


  


export default function ChecklistTab(props){
    
    const [constructorHasRun, setConstructorHasRun] = useState(false);
    
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [notes,SetNotes] = useState([]);
    
  
    async function loadNotes(){
            if (!constructorHasRun){
            let owner=JSON.parse(localStorage.getItem('userData'))['email'];
            setLoadingNotes(true);
            let res=await fetch(props.serverUrl+"/getChecklist/"+owner,{
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
                updateNotesList(data['checklists']);
                console.log(data['checklists']);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    
    

    
    return (
        <div className={classes.container}>
            {(notes.length===0 && !loadingNotes) && <div style={{textAlign:'center',marginTop:'50px'}}><p>No notes available</p></div>}
            {loadingNotes?<div style={{textAlign:'center',marginTop:'50px'}}><Spinner /></div>:<CheckListList signOut={props.signOut} callToast={props.callToast} serverUrl={props.serverUrl} updateNotesList={updateNotesList} notes={notes} />}
            <FullScreenDialog SetNotes={SetNotes} serverUrl={props.serverUrl} callToast={props.callToast} />
        </div>
    )
}