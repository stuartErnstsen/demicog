import { createStore, combineReducers } from 'redux';
import userReducer from './Reducers/userReducer';
import commentReducer from './Reducers/commentReducer'

const rootReducer = combineReducers({
    userReducer: userReducer,
    commentReducer: commentReducer
})

export default createStore(rootReducer);