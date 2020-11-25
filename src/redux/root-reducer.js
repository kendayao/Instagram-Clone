import {combineReducers} from 'redux'
import photoModalReducer from './photoModal/photoModal.reducer'

const rootReducer=combineReducers({
    modalStatus: photoModalReducer
})

export default rootReducer