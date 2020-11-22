import React, {useState} from 'react'
import {storage, db} from '../firebase/firebase'
import './ImageUpload.css'


function ImageUpload(){
    const [image, setImage]=useState(null)
    const [progress, setProgress]=useState(0)
    const [caption, setCaption]=useState('')

    const handleChange=event=>{
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    }

    const handleUpload=()=>{
        const uploadTask=storage.ref(`images/${image.name}`).put(image)
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
                    storage.ref("images").child(image.name).getDownloadURL()
                }

        )
    }


    return(
        <div>
            <input type="text" placeholder="Enter a caption..." onChange={(event)=>setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    )

}


export default ImageUpload