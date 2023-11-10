import jwtFetch from './jwt';

const RECEIVE_REVIEWS = "reviews/RECEIVE_REVIEWS";
const RECEIVE_REVIEW = "reviews/RECEIVE_REVIEW";
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";
const RECEIVE_REVIEW_ERRORS = "reviews/RECEIVE_REVIEW_ERRORS";
const CLEAR_REVIEW_ERRORS = "reviews/CLEAR_REVIEW_ERRORS";

const receiveReviews = reviews => ({
    type: RECEIVE_REVIEWS,
    reviews
});
const receiveReview = review => ({
    type: RECEIVE_REVIEW,
    review
});
const removeReview = reviewId => ({
    type: REMOVE_REVIEW,
    reviewId
});

const receiveErrors = errors => ({
    type: RECEIVE_REVIEW_ERRORS,
    errors
});

export const clearReviewErrors = errors => ({
    type: CLEAR_REVIEW_ERRORS,
    errors
});

export const getReview = reviewId => state => state?.reviews ? state.reviews[reviewId] : null;

export const fetchReviewer = (reviewerId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/reviews/user/${reviewerId}/reviewer`);
        const reviews = await res.json();
        dispatch(receiveReviews(reviews));
        return reviews;
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
}

export const fetchReviewee = (revieweeId) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/reviews/user/${revieweeId}/reviewee`);
        const reviews = await res.json();
        dispatch(receiveReviews(reviews));
        return reviews;
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
}

export const composeReview = (data) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/reviews/${data.trip}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const review = await res.json();
        dispatch(receiveReview(review));
        return review;
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
}

export const updateReview = (data) => async dispatch => {
    try {
        const res = await jwtFetch(`/api/reviews/${data._id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
        const review = await res.json();
        dispatch(receiveReview(review));
        return review;
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
}

export const deleteReview = (reviewId) => async dispatch => {
    try {
        // eslint-disable-next-line
        const res = await jwtFetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE'
        });
        dispatch(removeReview(reviewId));
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveErrors(resBody.errors));
        }
    }
}

const nullErrors = null;

export const reviewErrorsReducer = (state = nullErrors, action) => {
  switch(action.type) {
      case RECEIVE_REVIEW_ERRORS:
          return action.errors;
      case CLEAR_REVIEW_ERRORS:
          return nullErrors;
      default:
          return state;
  }
};

export const reviewReducer = (state = {}, action) => {
    const nextState = { ...state };
    switch (action.type) {
        case RECEIVE_REVIEWS:
            return {...action.reviews};
        case RECEIVE_REVIEW:
            return {...state, ...action.review};
        case REMOVE_REVIEW:
            delete nextState[action.reviewId];
            return nextState;
        default:
            return state;
    }
}

export default reviewReducer;