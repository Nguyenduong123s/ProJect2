import { combineReducers } from 'redux';
import { loginReducer } from './loginReducer';

const allReducers = combineReducers({
    loginReducer,
    // them nhieu reducer
});

export default allReducers;
