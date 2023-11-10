import { combineReducers } from 'redux';
import { sessionErrorsReducer } from './session';
import { tripErrorsReducer } from './trips';
import { usersErrorsReducer } from './users';
import { reviewErrorsReducer } from './review';

export default combineReducers({
    session: sessionErrorsReducer,
    trips: tripErrorsReducer,
    users: usersErrorsReducer,
    reviews: reviewErrorsReducer
});