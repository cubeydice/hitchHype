import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StarRatings from 'react-star-ratings';
import explodeAddress from '../../Trips/AddressParser';
import { composeReview } from '../../../store/review';

const ReviewForm = ({trip, reviewee}) => {
    const dispatch = useDispatch();
    const date = new Date(trip.departureDate);
    const errors = useSelector(state => state.errors.reviews);
    const reviewer = useSelector(state => state.session.user);
    const isDriver = (reviewee._id === trip.driver._id);
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    let destinationCity;
    let originCity;

    explodeAddress(trip.destination, function(err,addressStr)
    {
        destinationCity = addressStr.city;
    })
    explodeAddress(trip.origin, function(err,addressStr)
    {
        originCity = addressStr.city;
    })

    const handleChange = (field) => (e) => {
        e.preventDefault();

        switch (field) {
            case '':

                break;

            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const review = {
            reviewer: reviewer._id,
            reviewee: reviewee._id,
            trip: trip._id,
            isDriver,
            rating,
            title,
            body
        }

        dispatch(composeReview(review))
    }

    return (
        <div className='review-form'>
            <h2>How was the journey? 🧘</h2>
            <p>Rate your {isDriver ? "passenger" : "driver"} for your {isDriver ? "trip" : "ride"} from
            {originCity + " → " + destinationCity} on {date}</p>

            <form onSubmit={handleSubmit}>
                <label>
                    <h3>Rating</h3>
                    <p className="errors">{errors?.rating}</p>
                    <input type="text"></input>
                </label>
                <label>
                    <h3>Title</h3>
                    <p className="errors">{errors?.title}</p>
                    <input type="text"></input>
                </label>
                <label>
                    <h3>Body</h3>
                    <p className="errors">{errors?.body}</p>
                    <input type="text"></input>
                </label>
            </form>
        </div>
    )
}

export default ReviewForm;