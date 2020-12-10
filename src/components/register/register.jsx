import React, { useState,useEffect } from 'react';
import Spinner from '../spinner/spinner'
import classes from './register.module.css';
import { useHistory } from "react-router-dom";


function Register(props) {
    const[startValidating,setStartValidating]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const [isLoading,setIsLoading]=useState(false);
   
    const [userDetails,setUserDetails]=useState({
        firstName:"",
        lastName:"",
        email:"",
        password:""
    });
    const [validity,setValidity]=useState({
        firstName:true,
        lastName:true,
        email:true,
        password:true
    });
    useEffect(() => {
        startValidating && validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDetails]);
    function updateDetails(event){
        let name=event.target.name;
        let value=event.target.value;
         setUserDetails((prev)=>{
            return{
                ...prev,
                [name]:value
            }
        });
    }
    function validate(){
        let flag=false;
        for(let item of Object.entries(userDetails)){
            if(item[1]===""){
                setValidity((prev)=>{
                    return {
                        ...prev,
                        [item[0]]:false
                    }
                })
                flag=true;
            }else{
                setValidity((prev)=>{
                    return {
                        ...prev,
                        [item[0]]:true
                    }
                })
            }
        }
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(userDetails.email)))
        {
            setValidity((prev)=>{
                return {
                    ...prev,
                    email:false
                }
            })
            flag=true;
        }else{
            setValidity((prev)=>{
                return {
                    ...prev,
                    email:true
                }
            })
        }
        if(flag){
            return false;
        }else{
            return true;
        }
    }
   
    async function register(event){
        setErrorMessage("");
        event.preventDefault();
        setStartValidating(true);
        let valid=validate();
        if(valid){
            console.log(userDetails);
            setIsLoading(true);
            let res=await fetch(props.serverUrl+"/register", {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify(userDetails)
            }).catch((err)=>{
                console.log(err);
            });
            let data=await res.json();
            console.log(data);
            setIsLoading(false);
            if(data.error){
                setErrorMessage(data.error);
            }else{
                props.callToast("Registration Successfull");
                history.push('/');
            }
        }
    }
    const history = useHistory();
    function backtologin(){
        history.push("/");
    }
    return (
        <div className={classes.main}>
            <div className={classes.clip}>
                <div>
                    <div className={classes.semicircle}>
                        <div></div>
                    </div>
                </div>
            </div>
            <form className={classes.form} onSubmit={register}>
            <p className={classes.title}>Register</p>
                <div className={classes.namerow}>
                    <div className={classes.name}>
                        <label className={classes.label} htmlFor="">First Name</label>
                        <br/>
                        <input placeholder="Enter firstname" type="text" className={validity.firstName?null:classes.invalid} name="firstName" onChange={updateDetails} value={userDetails.firstName}/>
                    </div>
                    <div className={classes.name}>
                        <label className={classes.label} htmlFor="">Last Name</label>
                        <br/>
                        <input type="text" placeholder="Enter lastname"  name="lastName" className={validity.lastName?null:classes.invalid} onChange={updateDetails} value={userDetails.lastName}/>
                    </div>
                </div>
                <label className={classes.label} htmlFor="">Email</label>
                <br/>
                <input type="text" placeholder="Enter email" name="email" className={validity.email?null:classes.invalid} onChange={updateDetails} value={userDetails.email} />
                <br/>
                <label className={classes.label} htmlFor="">Password</label><br/>
                <input type="password" placeholder="Enter password" name="password" className={validity.password?null:classes.invalid} onChange={updateDetails} value={userDetails.password}/>
                <br/>
                {   isLoading?<Spinner />:
                    <div>
                        <div className={classes.row}>
                            <button type="button" onClick={backtologin}>Back to login</button>
                            <button type="submit">Register</button>
                        </div>
                         <div style={{'textAlign':'center',width:'80%',color:'red',fontSize:'1em',margin:"auto"}}>
                            <p>{errorMessage}</p>
                        </div>
                    </div>
                }
            </form>
        </div>
    );
}
export default Register;
