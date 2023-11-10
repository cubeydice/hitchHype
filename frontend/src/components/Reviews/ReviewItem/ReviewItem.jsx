import StarRatings from 'react-star-ratings';
import explodeAddress from '../../Trips/AddressParser';
import './ReviewItem.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const ReviewItem = ({review}) => {
    //TRIP INFO
    const trip = review.trip
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

    //REVIEWER INFO
    const reviewer = review.reviewer

    return (
        <div className="review-item-container">
            <div className="review-item-reviewer">
                <Link to={`/profile/${reviewer._id}`}>
                    <img src={reviewer.profilePicture} className='reviewer-pic' alt={reviewer._id}/>
                </Link>
            </div>

            <div className="review-item">
                <StarRatings
                            rating={review.rating}
                            starRatedColor="#e8ae42"
                            starDimension="20px"
                            starSpacing="1px"
                            className='rating'
                        />
                <h3>{review.title}</h3>
                <Link to={`/trips/${trip._id}`} className="review-trip">{destinationCity + " → " + originCity}</Link>
                <p className='light'>{review.body}</p>
            </div>
        </div>
    )
}

export default ReviewItem;