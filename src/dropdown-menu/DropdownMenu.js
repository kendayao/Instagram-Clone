import React from 'react'
import { Button } from '@material-ui/core';
import './DropdownMenu.css'
import {auth} from '../firebase/firebase'

function DropdownMenu({username}){
    return(
        <div className="dropdown">
            <p className="dropdown__header">{username}</p>
            <div className="dropdown__body"><i class="far fa-plus-square"></i> Add Photo</div>
            <div className="dropdown__footer">
                <Button onClick={()=>auth.signOut()}>LogOut</Button>
            </div>
        </div>
    )
}

export default DropdownMenu