import React, { useState,useEffect } from 'react';
// import { useHistory } from "react-router-dom";
import classes from './dashboard.module.css';
import Header from '../header/header';
import VerticalTabs from '../verticalTabs/verticaltabs';

export default function Dashboard(props){
    const [openHam,setOpenHam]=useState(true);
    function toggleHam(){
        setOpenHam(prev=>!prev);
      }
    
    return (
        <div>
            <Header signOut={props.signOut} toggleHam={toggleHam} />
            <VerticalTabs callToast={props.callToast} signOut={props.signOut} serverUrl={props.serverUrl}  openHam={openHam} />
        </div>
    )
}