import './App.css';
import Login from './components/login/login'
import Register from './components/register/register'
import {BrowserRouter as Router,Switch,Route, Redirect} from 'react-router-dom'
import { useState,useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Dashboard from './components/dashboard/dashboard';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function App() {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [serverUrl,setServerUrl]=useState('https://clonegooglekeep.herokuapp.com');
  const [isSignedIn,setIsSignedIn]=useState(false);

  useEffect(()=>{
    checkIsSignedIn();
  },[]);
  function signIn(token,userData){
    localStorage.setItem('userData',JSON.stringify(userData));
    localStorage.setItem('token',token);
    setIsSignedIn(true);
  }
  function signOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsSignedIn(false);
  }
  function checkIsSignedIn(){
    if(localStorage.getItem('token') && localStorage.getItem('userData')){
      !isSignedIn && setIsSignedIn(true);
    }else{
      isSignedIn && setIsSignedIn(false);
    }
  }
  function callToast(toastMessage){
    setToastMessage(toastMessage);
    setOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  
  return (
    <Router>
    <div className="App">
      <Switch>

        <Route path="/"  exact>
          {!isSignedIn?<Login signIn={signIn} serverUrl={serverUrl} callToast={callToast} />:<Redirect to='/dashboard' />}
        </Route>

        <Route path="/register" component={() => (<Register serverUrl={serverUrl} callToast={callToast} />)} />

        <Route path="/dashboard"  exact>
          {isSignedIn?<Dashboard  serverUrl={serverUrl} callToast={callToast} signOut={signOut} />:<Redirect to='/' />}
        </Route>
        
      </Switch>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
           <Alert onClose={handleClose} severity="success">
            {toastMessage}
            </Alert>
      </Snackbar>
    </div>
    </Router>
  );
}

export default App;
