const RECEIVE_MILES = 'ce/RECEIVE_MILES'

const receiveMiles = (miles) => ({
  type: RECEIVE_MILES,
  miles
})

export const fetchMiles = (miles) =>

export const milesReducer = (state = {}, action) => {
  switch(action.type) {
      case RECEIVE_MILES:
          return { ...action.miles};
      default:
          return state;
  }
};