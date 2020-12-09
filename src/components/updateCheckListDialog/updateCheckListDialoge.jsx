import React,{useState} from 'react';
import Spinner from '../spinner/spinner';
import Dialog from '@material-ui/core/Dialog';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';


import {
    withStyles,
    makeStyles,
  } from '@material-ui/core/styles';
  
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
const GreenCheckbox = withStyles({
    root: {
      color: '#000',
      '&$checked': {
        color:'#000',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);
const CssTextField = withStyles({
    root: { 
        '& .MuiInputBase-root': {
            color: '#000',
          },
        '& label':{
            color:'#000'
        },
        '& .MuiInput-underline':{
            color:'#000'
        },
      '& label.Mui-focused': {
        color: '#000',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: '#000',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#000',
          color:'#000'
        },
        '&:hover fieldset': {
          borderColor: '#000',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#000',
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
    appBar: {
        position: 'relative',
      },
      title: {
        marginLeft: theme.spacing(2),
        flex: 1,
      },
  }));
export default function UpdateCheckListDialog(props){
    
    const MaterialClasses = useStyles();
    const [loading, setLoading] = useState(false);
    const [validate, setValidate] = useState(false);
    const [selectedNote,setSelectedNote]=useState({...props.selectedNote});
    function addCheckListItem(event){
        event.stopPropagation();
        var code = (event.keyCode ? event.keyCode : event.which);
        let newItem={
            value:selectedNote.newCheckListItem,
            isChecked:false,
            id:String(Math.random()).substring(10)
        }
        if(code === 13 && selectedNote.newCheckListItem!=='') { 
            setSelectedNote(prev=>{
                return{
                    ...prev,
                    checklist:[...prev.checklist,newItem],
                    newCheckListItem:''
                }
            })
        }
    }
    function handleselectedNote(event){
        event.stopPropagation();
        let name=event.target.name;
        let value=event.target.value;
        setSelectedNote((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        });
    }
    function handleChecking(event,index){
        event.stopPropagation();
        let isChecked=event.target.checked;
        setSelectedNote((prev)=>{
            let newChecklist=[...prev.checklist];
            newChecklist[index]['isChecked']=isChecked;
            return {
                ...prev,
                checklist:newChecklist
            }
        });
    }
    function deleteCheckList(event,index){
        event.stopPropagation();
        setSelectedNote((prev)=>{
            let newChecklist=[...prev.checklist];
            newChecklist.splice(index,1);
            return {
                ...prev,
                checklist:newChecklist
            }
        });
    }
    async function updateNote(){
        setValidate(true);
        if(selectedNote.title!=='' && selectedNote.note!==''){
            setLoading(true);
            let res=await fetch(props.serverUrl+"/updateChecklist",{
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
                props.handleClose();
                props.updateNotesList(data['checklists']);
                props.callToast(data['message']);
            }
        }
    }

    return (
        <Dialog  fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
            <AppBar className={MaterialClasses.appBar} style={{backgroundColor:" #202124"}}>
                <Toolbar >
                    <IconButton disabled={loading} edge="start" color="inherit" onClick={props.handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={MaterialClasses.title}>
                        Checklist
                    </Typography>
                    {loading?<Spinner/>:
                    <Button autoFocus color="inherit" onClick={updateNote}>
                        <SaveIcon/>&nbsp; Update
                    </Button>}
                
                </Toolbar>
            </AppBar>
            <List style={{padding:"20px 20px 40px 20px"}}>
                <ListItem >
                        <div className={MaterialClasses.margin} style={{width:'100%'}}>
                            <Grid container spacing={1} alignItems="flex-end"  style={{width:'100%'}}>
                                <Grid item>
                                    <AddIcon style={{color:'#000'}} />
                                </Grid>
                                <Grid item  style={{width:'80%'}}>
                                    <CssTextField disabled={loading}  error={selectedNote.checklist.length===0 && validate?true:false} onKeyUp={addCheckListItem} onChange={handleselectedNote} name="newCheckListItem" value={selectedNote.newCheckListItem} fullWidth  id="custom-css-standard-input"  />
                                </Grid>
                            </Grid>
                        </div>
                </ListItem>
                    {
                        selectedNote.checklist.map((item,index)=>
                            !item.isChecked &&
                                <ListItem key={item['id']}>
                                    <FormControlLabel 
                                        disabled={loading}
                                        onChange={(event)=>handleChecking(event,index)}
                                        control={<GreenCheckbox checked={item['isChecked']}  name="checkedG" />}
                                        label={<Typography variant="h6" style={{ color: '#000' }}>{item['value']}</Typography>}
                                    />
                                    <IconButton edge="start" color="inherit" disabled={loading} onClick={(event)=>deleteCheckList(event,index)} aria-label="close">
                                            <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                            )
                            
                    }
                
                <ListItem>
                    {   selectedNote.checklist.filter(item=>item.isChecked).length!==0 && 
                            <div>
                                <br/>
                                <p style={{color:'#000',fontSize:'1.5em',fontWeight:'600'}}>Checked Item</p>
                            </div>
                    }
                    </ListItem>
                    {
                            selectedNote.checklist.map((item,index)=>
                                item.isChecked &&
                                    <ListItem key={item['id']}>
                                        <FormControlLabel 
                                            disabled={loading}
                                            onChange={(event)=>handleChecking(event,index)}
                                            control={<GreenCheckbox checked={item['isChecked']}  name="checkedG" />}
                                            label={<Typography variant="h6" paragraph style={{ color: '#000',textDecoration:'line-through',whiteSpace:'pre-wrap' }}>{item['value']}</Typography>}
                                        />
                                        <IconButton edge="start" color="inherit" disabled={loading} onClick={(event)=>deleteCheckList(event,index)} aria-label="close">
                                            <DeleteIcon />
                                        </IconButton>
                                        <br/>
                                    </ListItem>           
                            )
                        }
            </List>
        </Dialog>
    )
}