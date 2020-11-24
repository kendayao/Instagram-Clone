import React, {useState} from 'react'
import firebase from 'firebase';
import {storage, db} from '../../firebase/firebase'
import './ImageUpload.css'


function ImageUpload({username}){
    const [image, setImage]=useState(null)
    const [progress, setProgress]=useState(0)
    const [caption, setCaption]=useState('')

    const handleChange=event=>{
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    }

    
    const handleUpload=()=>{
        if(image && caption){
        const uploadTask=storage.ref(`images/${image?.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                //progress function...progress indicator from 0-100
                const progress=Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress)
            },
            (error)=>{
                console.log(error);
            },
            // upload completes this is what happens
                ()=>{
                    storage.ref("images").child(image?.name).getDownloadURL()
                    .then(url=>{
                        // post image and caption to inside db
                        db.collection("posts").add({
                            // get server timestamp
                            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                        
                    })
                }

        )
            }else{
                alert("image and caption is required")
            }
    }

   

    return(
        <div className="image-upload">
            <h3 className="image-upload-progress-title">Add a photo</h3>
            <input className="image-upload-text" type="text" placeholder="Enter a caption..." onChange={(event)=>setCaption(event.target.value)} value={caption}/>
            <input className="image-upload-file"type="file" onChange={handleChange} />
            <progress className="image-upload-progress" value={progress} max='100'/>
            <button className="image-upload-button" onClick={handleUpload}>Upload</button>
        </div>
    )

}


export default ImageUpload