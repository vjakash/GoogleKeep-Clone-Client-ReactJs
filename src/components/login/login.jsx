import React, { useState,useEffect } from 'react';
import classes from './login.module.css';
import { useHistory } from "react-router-dom";
import Spinner from '../spinner/spinner'

function Login(props){
    const history = useHistory();
    function register(){
        history.push("/register");
    }
    const[startValidating,setStartValidating]=useState(false);
    const [errorMessage,setErrorMessage]=useState("");
    const [isLoading,setIsLoading]=useState(false);

    const [loginDetails,setLoginDetails]=useState({
        email:"",
        password:""
    });
    const [validity,setValidity]=useState({
        email:true,
        password:true
    });

    useEffect(() => {
        startValidating && validate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginDetails]);

    function updateDetails(event){
        let name=event.target.name;
        let value=event.target.value;
         setLoginDetails((prev)=>{
            return{
                ...prev,
                [name]:value
            }
        });
    }
    function validate(){
        let flag=false;
        for(let item of Object.entries(loginDetails)){
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
        if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(loginDetails.email)))
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
    async function login(event){
        setErrorMessage("");
        event.preventDefault();
        setStartValidating(true);
        let valid=validate();
        if(valid){
            // console.log(loginDetails);
            setIsLoading(true);
            let res=await fetch(props.serverUrl+"/login", {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify(loginDetails)
            }).catch((err)=>{
                console.log(err);
            });
            let data=await res.json();
            console.log(data);
            setIsLoading(false);
            if(data.error){
                setErrorMessage(data.error);
            }else{
                props.callToast("Login Successfull");
                props.signIn(data['token'],data['data']);
            }
        }
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
            <form className={classes.form} onSubmit={login}>
            <p className={classes.title}>Login</p>
            <label className={classes.label} htmlFor="">Email</label>
            <br/>
                <input type="text" placeholder="Enter email" className={validity.email?null:classes.invalid} onChange={updateDetails} name="email" value={loginDetails.email}/>
                <br/>
                <label className={classes.label} htmlFor="">Password</label><br/>
                <input type="password" placeholder="Enter password" className={validity.password?null:classes.invalid} onChange={updateDetails} name="password" value={loginDetails.password}/>
                <br/>
                {isLoading?<Spinner/>:
                    <div>
                        <div className={classes.row}>
                            <p>forgot password?</p>
                             <button type="submit">Sign In</button>
                        </div>
                        <div className={classes.signuprow}>
                            <p>New user? <span onClick={register}>Signup</span></p>
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
export default Login;