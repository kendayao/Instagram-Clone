import React, { useEffect, useState } from 'react';
import './App.css';
import ImageUpload from './components/image-upload/ImageUpload'
import Post from './components/post/Post';
import {db, auth} from './firebase/firebase'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 350,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #dbdbdb',
    borderRadius: '3px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none"
  },
}));

function App() {
  const classes=useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts]=useState([]);
  const [open, setOpen]=useState(false);
  const [openSignIn, setOpenSignIn]=useState(false)
  const [openAddPhoto, setOpenAddPhoto]=useState(false)
  const [username, setUsername]=useState('');
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const [user, setUser]=useState(null)
  const [dropdown, setDropdown]=useState(false)

  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        // user has logged in
        setUser(authUser);
      }else{
        // user has logged out
        setUser(null);
      }

    })

    return()=>{
      unsubscribe();
    }
  },[])

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        id: doc.id,
        post:doc.data()
        
      })));
    })
  },[])
  
  function signUp(event){
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username,
      })
    })
    .catch((error)=>alert(error.message))
    setUsername('')
    setEmail('')
    setPassword('')
    setOpen(false)
  }

  function signIn(event){
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error)=>alert(error.message))
    setEmail('')
    setPassword('')
    setOpenSignIn(false)
  }
  
  console.log(user)
  return (
   
    <div className="app">
      <Modal
        open={open}
        // on close listens to clicks outside the modal. materialize built that for us
        onClose={()=>setOpen(false)}
      >
         <div style={modalStyle} className={classes.paper}>
           <form className="app__signup">
            <center>
              <img className="app__header-imageModal" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png" alt="instagram logo" />
              
            </center>
            <center>
            <img className="app__header-iconModal" src="https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-instagram-new-circle-512.png" alt="instagram logo" />
            </center>

            <center className="app__header-subtitle">Sign up to post pictures, write comments, and like photos.</center>
            
            <Input
                className="app__input"
                placeholder='username'
                type='username'
                value={username}
                onChange={event=>setUsername(event.target.value)}
                required
              />
              <Input
                className="app__input" 
                placeholder='email'
                type='email'
                value={email}
                onChange={event=>setEmail(event.target.value)}
                required
              />
              <Input
                className="app__input" 
                placeholder='password'
                type='password'
                value={password}
                onChange={event=>setPassword(event.target.value)}
                required
              />
              <button className="app__modal-button" type="submit" onClick={signUp}>Sign Up</button>
           </form>
         </div>
      </Modal>

      <Modal
        open={openSignIn}
        // on close listens to clicks outside the modal. materialize built that for us
        onClose={()=>setOpenSignIn(false)}
      >
         <div style={modalStyle} className={classes.paper}>
           <form className="app__signup">
            <center>
              <img className="app__header-imageModal" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png" alt="instagram logo" />
              
            </center>
            <center>
            <img className="app__header-iconModal" src="https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-instagram-new-circle-512.png" alt="instagram logo" />
            </center>

            <center className="app__header-subtitle">Sign in to post pictures, write comments, and like photos.</center>
              <Input
                className="app__input" 
                placeholder='email'
                type='email'
                value={email}
                onChange={event=>setEmail(event.target.value)}
                required
              />
              <Input
                className="app__input" 
                placeholder='password'
                type='password'
                value={password}
                onChange={event=>setPassword(event.target.value)}
                required
              />
              <button className="app__modal-button" type="submit" onClick={signIn}>Sign In</button>
           </form>
         </div>
      </Modal>

      <Modal
        className="test"
        open={openAddPhoto}
        // on close listens to clicks outside the modal. materialize built that for us
        onClose={()=>setOpenAddPhoto(false)}
      >
         <div style={modalStyle} className={classes.paper}>
           <div className="app__addPhoto-modal">
           <ImageUpload username={user?.displayName}/>
           </div>
         </div>
      </Modal>

      

      <div className="app__header">
      <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram logo" />
      {user?<Avatar 
              onClick={()=>setDropdown(!dropdown)}
              className="post__avatar"
              alt={user.displayName.toUpperCase()}
              src="/static/images/avatar/1.jpg"
              />:
      <div className="app__loginContainer">
        <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
        <Button onClick={()=>setOpen(true)}>Sign Up</Button>
      </div>
    }
        {dropdown? <div className="dropdown">
            <p className="dropdown__header">{user.displayName}</p>
            <div className="dropdown__body" onClick={()=>{setOpenAddPhoto(true); setDropdown(false);}}><i class="far fa-plus-square"></i> Add Photo</div>
            <div className="dropdown__footer">
                <Button onClick={()=>{auth.signOut(); setDropdown(false);}}>LogOut</Button>
            </div>
        </div>: null}
     </div>

    <div className="app__posts">
    {posts.map(({id, post})=>(
      <Post key={post.timestamp} user={user} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
    ))}
    </div>

  
    </div>
  );

 
}

export default App;
