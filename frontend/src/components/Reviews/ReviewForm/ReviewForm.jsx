import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import explodeAddress from '../../Trips/AddressParser';

//STORE
import { clearReviewErrors, composeReview } from '../../../store/review';
import { fetchTrip, getTrip } from '../../../store/trips';
import { fetchUser } from '../../../store/users';

//ASSETS
import { ReactComponent as Loading } from '../../../assets/icons/loading-icon.svg';
import './ReviewForm.css'

const ReviewForm = () => {
    const dispatch = useDispatch();
    const { tripId, revieweeId } = useParams();
    const errors = useSelector(state => state.errors.reviews);
    const reviewee = useSelector(state => state.users.user)
    const reviewer = useSelector(state => state.session.user);
    const trip = useSelector(getTrip(tripId));
    const [isDriver, setIsDriver] = useState(false)
    const [date, setDate]  = useState(new Date());

    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const [destinationCity, setDestinationCity] = useState("");
    const [originCity, setOriginCity] = useState("");
    const [loaded, isLoaded] = useState(false);

    useEffect(() => {
        dispatch(fetchUser(revieweeId))
        dispatch(fetchTrip(tripId))
        .then(res => {
            console.log(res)
            setIsDriver( reviewer._id === res.driver._id)
            console.log(isDriver)
            setDate(new Date(res.departureDate))
            explodeAddress(res.destination, function(err,addressStr)
            {
                setDestinationCity(addressStr.city);
            })
            explodeAddress(res.origin, function(err,addressStr)
            {
                setOriginCity(addressStr.city);
            })
        })
        .then(()=>{
            setTimeout(()=> {
                isLoaded(true)
            }, 300)
        })
        // eslint-disable-next-line
    }, [dispatch, revieweeId, tripId])


    const handleChange = (field) => (e) => {
        e.preventDefault();

        switch (field) {
            case 'title':
                setTitle(e.currentTarget.value)
                break;
            case 'body':
                setBody(e.currentTarget.value)
                break;
            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const review = {
            reviewer: reviewer._id,
            reviewee: revieweeId,
            trip: tripId,
            isDriver,
            rating,
            title,
            body
        }

        dispatch(composeReview(review)).then((res) =>
        {
            if (res && !res.errors) {
                dispatch(clearReviewErrors());
            }
        }
        )
    }

    if (!loaded) return <Loading/>
    return (
        <div className='review-form-container'>
            <h1>How was the {isDriver ? "trip" : "ride"}? 🧘</h1>
            <div className='review-form-reviewee'>
                <img src={reviewee.profilePicture}
                className='large-icon'
                id="review-profile-pic"
                alt={reviewee.firstName}/>
                <div>
                    <h2 id='reviewee-name'>{reviewee.firstName}</h2>
                    <div className='reviewee-trip-details'>
                        <h3>{originCity + " → " + destinationCity}</h3>
                        <p>{date.toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='review-form'>
                <label>
                    <h3>Rating</h3>
                    <p className="errors">{errors?.rating}</p>
                    <StarRatings
                    rating={rating}
                    starRatedColor="#e8ae42"
                    starHoverColor="#f87666"
                    changeRating={setRating}
                    numberOfStars={5}
                    className='rating'
                    />
                </label>

                <label>
                    <h3>Title</h3>
                    <p className="errors">{errors?.title}</p>
                    <input type="text"
                    value={title}
                    placeholder='Title of your review'
                    onChange={handleChange('title')}
                    id="review-title-input"
                    />
                </label>

                <label>
                    <h3>Body</h3>
                    <p className="errors">{errors?.body}</p>
                    <textarea
                    value={body}
                    placeholder={`How was your trip with ${reviewee.firstName}?`}
                    rows={8}
                    cols={70}
                    onChange={handleChange('body')}
                    />
                </label>
                <input
                type="submit"
                value="Submit Review"
                ></input>
            </form>
        </div>
    )
}

export default ReviewForm;