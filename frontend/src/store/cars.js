import jwtFetch from "./jwt"

//ACTION CONSTANTS
const RECEIVE_CAR = 'cars/RECEIVE_CAR'
const REMOVE_CAR = 'cars/REMOVE_CAR'

//POJO ACTIONS
const receiveCar = (car) => ({
  type: RECEIVE_CAR,
  car
})

const removeCar = (carId) => ({
  type: REMOVE_CAR,
  carId
})

//THUNK ACTIONS
const fetchCar = (car) => {}