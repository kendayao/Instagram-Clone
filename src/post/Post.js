import React, { useEffect, useState } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import {db} from '../firebase/firebase';
import firebase from 'firebase';

function Post({username, user, postId, caption, imageUrl}){

    const [comments, setComments]=useState([])
    const [comment, setComment]=useState('')

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

        return()=>{
            unsubscribe();
        }
   
    }, [postId]);

    const postComment=(event)=>{
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setComment('')
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt={username.toUpperCase()}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} />
            <h4 className="post__text"><strong>{username}:</strong> {caption}</h4>

            <div className="post__comments">
            {comments.map(commentItem=>(
                <p key={commentItem.id}>
                    <strong>{commentItem.username}:</strong> {commentItem.text}
                </p>
            ))}
            </div>

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
                className="post__button"
                // if there is no comment, button is disabled
                disabled={!comment}
                type="submit"
                onClick={postComment}
                >Post
                </button>
            </form>
        </div>
       
    )
}

export default Post;