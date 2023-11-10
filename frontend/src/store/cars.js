import jwtFetch from "./jwt"

//ACTION CONSTANTS
const RECEIVE_CAR = 'cars/RECEIVE_CAR'
const REMOVE_CAR = 'cars/REMOVE_CAR'
const RECEIVE_CAR_ERRORS = 'cars/RECEIVE_CAR_ERRORS'
const CLEAR_CAR_ERRORS = 'cars/CLEAR_CAR_ERRORS'

//POJO ACTIONS
const receiveCar = (car) => ({
  type: RECEIVE_CAR,
  car
})

const removeCar = (carId) => ({
  type: REMOVE_CAR,
  carId
})

const receiveErrors = errors => ({
  type: RECEIVE_CAR_ERRORS,
  errors
});

export const clearCarErrors = errors => ({
  type: CLEAR_CAR_ERRORS,
  errors
});


//THUNK ACTIONS
export const fetchCar = (userId) => async dispatch => {
  try {
    const res = await jwtFetch(`/api/cars/user/${userId}`)
    const car = await res.json();
    dispatch(receiveCar(car))
    return car;

  } catch(err) {
    const res = await err.json();
    if (res.statusCode === 400) {
      dispatch(receiveErrors(res.errors))
    }
  }
}

export const createCar = data => async dispatch => {
  try {
    const res = await jwtFetch(`/api/cars`, {
      method: `POST`,
      body: JSON.stringify(data)
    })
    const car = await res.json();
    dispatch(receiveCar(car));
    return car;
  } catch(err) {
    const res = await err.json();
    if (res.statusCode === 400) {
      dispatch(receiveErrors(res.errors))
    }
  }
 }

 export const updateCar = data => async dispatch => {
  try {
    const res = await jwtFetch(`/api/cars/${data._id}`, {
      method: `PATCH`,
      body: JSON.stringify(data)
    })
    const car = await res.json();
    dispatch(receiveCar(car));
    return car;

  } catch(err) {
    const res = await err.json();
    if (res.statusCode === 400) {
      dispatch(receiveErrors(res.errors))
    }
  }
 }

 export const deleteCar = carId => async dispatch => {
  try {
    // eslint-disable-next-line
    const res = await jwtFetch(`/api/cars/${carId}`, {
      method: `DELETE`
    })
    dispatch(removeCar(carId));

  } catch(err) {
    const res = await err.json();
    if (res.statusCode === 400) {
      dispatch(receiveErrors(res.errors))
    }
  }
 }

 const nullErrors = null;

export const carErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
      case RECEIVE_CAR_ERRORS:
          return action.errors;
      case CLEAR_CAR_ERRORS:
          return nullErrors;
      default:
          return state;
  }
};

const carsReducer = (state = {}, action) => {
  const nextState = { ...state };
  switch(action.type) {
      case RECEIVE_CAR:
          return { ...state, ...action.car};
      case REMOVE_CAR:
          delete nextState[action.carId];
          return nextState;
      default:
          return state;
  }
};

export default carsReducer;