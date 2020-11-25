// react and componenets imports
import React, { useEffect, useState } from 'react';
import './Post.css';
//material UI imports
import Avatar from '@material-ui/core/Avatar';
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles';
//firebase imports
import {db} from '../../firebase/firebase';
import firebase from 'firebase';

// material ui styles
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
      borderRadius: '8px',
      boxShadow: theme.shadows[5],
      outline: "none"
    },
  }));


function Post({username, user, postId, caption, imageUrl}){
    const [modalStyle] = React.useState(getModalStyle);
    const classes=useStyles();
    const [comments, setComments]=useState([])
    const [comment, setComment]=useState('')
    const [likes, setLikes]=useState([])
    const [openLikesModal, setOpenLikesModal]=useState(false)
   
    useEffect(()=>{
        let unsubscribe;
        if(postId){
        unsubscribe=db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot)=>(
            setComments(snapshot.docs.map((doc)=>doc.data()))
        ))
        }
        if(postId){
            unsubscribe=db
            .collection("posts")
            .doc(postId)
            .collection("likes")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot)=>(
                setLikes(snapshot.docs.map((doc)=>doc.data()))
            ))
            }
        return()=>{
            unsubscribe();
        }
    }, [postId]);

//add comment to firebase database
    const postComment=(event)=>{
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setComment('')
    }

//add like to firebase database
    const handleLike=()=>{
        db.collection("posts").doc(postId).collection("likes").add({
            likeUser: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }
//delete like from firebase database
    const handleUnlike=()=>{
        db.collection("posts").doc(postId).collection("likes").where("likeUser", "==", user.displayName)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            doc.ref.delete();
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    }

    const likeCount=likes.length-1

    return (
        <div className="post">
            <Modal
                open={openLikesModal}
                onClose={()=>setOpenLikesModal(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="post__modal-header">
                        <h3>Likes</h3>
                    </div>
                    <div className="post__modal-body">
                        {likes.map(likeItem=>{
                            return <div key={likeItem.likeUser} className="post__modal-body-item" >
                            <Avatar 
                            className="post__avatar-modal"
                            alt={likeItem.likeUser}
                            src="/static/images/avatar/1.jpg"
                            />
                            <p className="post__modal-body-name">{likeItem.likeUser}</p></div>
                        })}
                    </div>
                </div>
            </Modal>

            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} alt="post display" />
            {user?
            <div className="post__likes"><i onClick={(likes.some(like=>like['likeUser']===user.displayName))?handleUnlike:handleLike}  className={likes.some(like=>like['likeUser']===user.displayName)? "fas fa-heart fa-lg":"far fa-heart fa-lg" } ></i> {likes.length>=1? <p className="post__like-text">liked by <strong>{likes[0].likeUser}</strong> and <strong onClick={()=>setOpenLikesModal(true)} className="post___like-click">{likeCount} others</strong></p> : likes.length+" likes" }</div>:
            <div className="post__likes"><i className="far fa-heart fa-lg"></i> {likes.length} likes</div>
            }
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div className="post__comments">
                {comments.map(commentItem=>(
                <p key={commentItem.timestamp} className='post__comments-comment'>
                    <strong>{commentItem.username}</strong> {commentItem.text}
                </p>
                ))}
            </div>

            {user&& 
                <form className="post__form">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={event=>setComment(event.target.value)}
                    >
                    </input>
                    <button
                        className={comment?"post__button-dark":"post__button"}
                        // if there is no comment, button is disabled
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                        >Post
                    </button>
                </form>
            } 
        </div>
       
    )
}

export default Post;