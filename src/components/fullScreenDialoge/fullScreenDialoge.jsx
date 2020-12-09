import React,{useState} from 'react';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Spinner from '../spinner/spinner';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
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
const GreenCheckbox = withStyles({
    root: {
      color: '#000',
      '&$checked': {
        color:'#000',
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
    let initialNewNoteValue={
        checklist:[],
        newCheckListItem:'',
        owner:JSON.parse(localStorage.getItem('userData'))['email']
    }
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [newNote,setNewNote]=useState(initialNewNoteValue);
    const [loading, setLoading] = useState(false);
    const [validateNewNote, setValidateNewNote] = useState(false);

    function addCheckListItem(event){
        var code = (event.keyCode ? event.keyCode : event.which);
        let newItem={
            value:newNote.newCheckListItem,
            isChecked:false,
            id:String(Math.random()).substring(10)
        }
        if(code === 13 && newNote.newCheckListItem!=='') { 
            setNewNote(prev=>{
                return{
                    ...prev,
                    checklist:[...prev.checklist,newItem],
                    newCheckListItem:''
                }
            })
        }
    }
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
    function handleChecking(event,index){
        let isChecked=event.target.checked;
        setNewNote((prev)=>{
            let newChecklist=[...prev.checklist];
            newChecklist[index]['isChecked']=isChecked;
            return {
                ...prev,
                checklist:newChecklist
            }
        });
    }
    function deleteCheckList(event,index){
        setNewNote((prev)=>{
            let newChecklist=[...prev.checklist];
            newChecklist.splice(index,1);
            return {
                ...prev,
                checklist:newChecklist
            }
        });
    }
    async function addNewNote(){
        setValidateNewNote(true);
        if(newNote.title!=='' && newNote.note!==''){
            setLoading(true);
            let res=await fetch(props.serverUrl+"/addChecklist",{
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
                props.SetNotes(data['checklists']);
                props.callToast(data['message']);
            }
        }
    }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValidateNewNote(false);
    setNewNote(initialNewNoteValue);
  };

  return (
    <div>
     <Fab onClick={handleClickOpen} style={{backgroundColor:'#fdd835',right:'30px',bottom:'30px',position:'fixed'}} aria-label="add">
                <AddIcon />
    </Fab>
      <Dialog  fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar} style={{backgroundColor:" #202124"}}>
          <Toolbar >
            <IconButton disabled={loading} edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              New Checklist
            </Typography>
            {loading?<Spinner/>:
            <Button autoFocus color="inherit" onClick={addNewNote}>
              <SaveIcon/>&nbsp; Save
            </Button>}
            
          </Toolbar>
        </AppBar>
        <List style={{padding:"20px 20px 40px 20px"}}>
        <ListItem >
                <div className={classes.margin} style={{width:'100%'}}>
                    <Grid container spacing={1} alignItems="flex-end"  style={{width:'100%'}}>
                        <Grid item>
                            <AddIcon style={{color:'#000'}} />
                        </Grid>
                        <Grid item  style={{width:'80%'}}>
                            <CssTextField disabled={loading}  error={newNote.checklist.length===0 && validateNewNote?true:false} onKeyUp={addCheckListItem} onChange={handleNewNote} name="newCheckListItem" value={newNote.newCheckListItem} fullWidth  id="custom-css-standard-input"  />
                        </Grid>
                    </Grid>
                </div>
          </ListItem>
            {
                newNote.checklist.map((item,index)=>
                    !item.isChecked &&
                        <ListItem  key={item['id']}>
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
            {   newNote.checklist.filter(item=>item.isChecked).length!==0 && 
                    <div>
                        <br/>
                        <p style={{color:'#000',fontSize:'1.5em',fontWeight:'600'}}>Checked Item</p>
                    </div>
            }
            </ListItem>
            {
                    newNote.checklist.map((item,index)=>
                        item.isChecked &&
                            <ListItem  key={item['id']}>
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
    </div>
  );
}