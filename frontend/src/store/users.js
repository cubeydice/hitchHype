import jwtFetch from './jwt';

//ACTION CONSTANTS
const RECEIVE_USER = "users/RECEIVE_USER";
const REMOVE_USER = "users/REMOVE_USER";
const RECEIVE_USER_ERRORS = "users/RECEIVE_USER_ERRORS";
const CLEAR_USER_ERRORS = "users/CLEAR_USER_ERRORS";

//POJO ACTIONS
const receiveUser = user => ({
    type: RECEIVE_USER,
    user
});

const removeUser = user => ({
    type: REMOVE_USER,
    user
});

const receiveErrors = errors => ({
    type: RECEIVE_USER_ERRORS,
    errors
});

export const clearUserErrors = errors => ({
    type: CLEAR_USER_ERRORS,
    errors
});

//THUNK ACTIONS
export const getUser = userId => state => {
    return state?.users.all ? state.users.all[userId] : null;
}

export const fetchUser = (userId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/users/${userId}`);
        const user = await res.json();
        dispatch(receiveUser(user));
        return user;
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            dispatch(receiveErrors(res.errors));
        }
    }
}

export const updateUser = (user) => async (dispatch) => {
    try {
        // debugger
        const res = await jwtFetch(`/api/users/${user._id}`, {
            method: 'PATCH',
            body: JSON.stringify(user)
        });
        user = await res.json();
        console.log(user)
        dispatch(receiveUser(user));
    } catch(err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveErrors(res.errors));
        }
    }
};

export const deleteUser = userId => async (dispatch) => {
    const response = await jwtFetch (`/api/users/${userId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(removeUser(userId));
    }

    return response;
};

const nullErrors = null;

export const usersErrorsReducer = (state = nullErrors, action) => {
    switch(action.type) {
        case RECEIVE_USER_ERRORS:
            return action.errors;
        case CLEAR_USER_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const usersReducer = (state = {}, action) => {
    const nextState = { ...state };
    switch(action.type) {
        case RECEIVE_USER:
            return { ...state, ...action.user};
        case REMOVE_USER:
            delete nextState[action.user]
            return nextState;
        default:
            return state;
    }
};

export default usersReducer;