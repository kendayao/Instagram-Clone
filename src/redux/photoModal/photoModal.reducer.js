const INITIAL_STATE={
    currentStatus: false
}

const photoModalReducer=(state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'SET_PHOTO_MODAL':
            return{
                ...state,
                currentStatus: action.payload
            }
            default: 
                return state
    }
}

export default photoModalReducer