import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StarRatings from 'react-star-ratings';
import explodeAddress from '../../Trips/AddressParser';
import { composeReview } from '../../../store/review';

const ReviewForm = ({reviewee}) => {
    const dispatch = useDispatch();
    const errors = useSelector(state => state.errors.reviews);
    const reviewer = useSelector(state => state.session.user);
    const trip = useSelector(state => state.trips);
    const isDriver = (reviewee._id === trip.driver._id);
    const date = new Date(trip.departureDate);
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
            case 'title':
                setTitle(e.currentTarget.value)
                break;
            case 'body':
                setTitle(e.currentTarget.value)
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
                    <input type="text">

                    </input>
                </label>

                <label>
                    <h3>Title</h3>
                    <p className="errors">{errors?.title}</p>
                    <input type="text"
                    value={title}
                    placeholder='Title of your review'
                    onChange={handleChange('title')}
                    />
                </label>

                <label>
                    <h3>Body</h3>
                    <p className="errors">{errors?.body}</p>
                    <input type="text"
                    value={body}
                    placeholder={`How was your trip with ${reviewee.name}?`}
                    onChange={handleChange('body')}
                    />
                </label>
            </form>
        </div>
    )
}

export default ReviewForm;