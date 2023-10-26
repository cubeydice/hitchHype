import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { tripErrorsReducer } from './trips';
import { usersErrorsReducer } from './users';

export default combineReducers({
    session: sessionErrorsReducer,
    trips: tripErrorsReducer,
    users: usersErrorsReducer
});