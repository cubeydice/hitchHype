import jwtFetch from './jwt';
import { RECEIVE_USER_LOGOUT } from './session';

const RECEIVE_TRIPS = "trips/RECEIVE_TRIPS";
const RECEIVE_TRIP = "trips/RECEIVE_TRIP";
const REMOVE_TRIP = "trips/REMOVE_TRIP";
const RECEIVE_TRIP_ERRORS = "trips/RECEIVE_TRIP_ERRORS";
const CLEAR_TRIP_ERRORS = "trips/CLEAR_TRIP_ERRORS";

const receiveTrips = trips => ({
    type: RECEIVE_TRIPS,
    trips
});
const receiveTrip = trip => ({
    type: RECEIVE_TRIP,
    trip
});
const removeTrip = tripId => ({
    type: REMOVE_TRIP,
    tripId
});

const receiveErrors = errors => ({
    type: RECEIVE_TRIP_ERRORS,
    errors
});

export const clearTripErrors = errors => ({
    type: CLEAR_TRIP_ERRORS,
    errors
});

// export const getTripts = state => {
//     // console.log(state)
//     // return state?.trips ? Object.values(state.events) : [];
//     return state?.trips ?  state.trips : [];
// }

export const getTrip = tripId => state => {
    // console.log('state: ',state.events[eventId])
    return state?.trips.all ? state.trips.all[tripId] : null;
}
// debugger
export const fetchTrip = (tripId) => async dispatch => {
    // debugger
    try {
        const res = await jwtFetch(`/api/trips/${tripId}`);
        const trip = await res.json();
        dispatch(receiveTrip(trip));
        return trip;
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
}

export const fetchTrips = () => async dispatch => {
    // debugger
    try {
        const res = await jwtFetch('/api/trips/');
        const trips = await res.json();
        dispatch(receiveTrips(trips));
        return trips;
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
};

export const fetchUserTrips = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/trips/user/${userId}`);
        const trips = await res.json();
        dispatch(receiveTrips(trips));
        return trips;
    } catch(err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};
export const fetchUserRides = userId => async dispatch => {
    try {
        const res = await jwtFetch(`/api/trips/user/${userId}/rides`);
        const trips = await res.json();
        dispatch(receiveTrips(trips));
        return trips;
    } catch(err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};

export const composeTrip = data => async dispatch => {
    try {
        const res = await jwtFetch('/api/trips/', {
            method: 'POST',
            body: JSON.stringify(data)
    });
        const trip = await res.json();
        dispatch(receiveNewTrip(trip));
        return trip
    } catch(err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};

export const updateTrip = data => async (dispatch) => {
    try {
        const res = await jwtFetch(`/api/trips/${data._id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
    });
        const trip = await res.json();
        dispatch(receiveTrip(trip));
    } catch(err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};
export const deleteTrip = tripId => async (dispatch) => {
    // debugger
    try {
        const res = await jwtFetch(`/api/trips/${tripId}`, {
            method: 'DELETE'
    });
        // const trip = await res.json();
        dispatch(removeTrip(tripId));
    } catch(err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            return dispatch(receiveErrors(resBody.errors));
        }
    }
};


const nullErrors = null;

export const tripErrorsReducer = (state = nullErrors, action) => {
    switch(action.type) {
        case RECEIVE_TRIP_ERRORS:
            return action.errors;
        case CLEAR_TRIP_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const tripsReducer = (state = {}, action) => {
    const nextState = { ...state };
    switch(action.type) {
        case RECEIVE_TRIP:
            return { ...state, ...action.trip};
        case REMOVE_TRIP:
            const newState = { ...state };
            delete newState[action.tripId];
            return newState;
        case RECEIVE_TRIPS:
            return { ...state, ...action.trips};
        // case RECEIVE_USER_LOGOUT:
        //     return { ...state, user: {}, new: undefined }
        default:
            return state;
    }
};

export default tripsReducer;