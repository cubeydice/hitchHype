import StarRatings from 'react-star-ratings';
import explodeAddress from '../../Trips/AddressParser';
import './ReviewItem.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const ReviewItem = ({review}) => {
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

    return (
        <div className="review-item">
        <div>
        <StarRatings
                    rating={review.rating}
                    starRatedColor="#e8ae42"
                    starDimension="20px"
                    starSpacing="1px"
                    className='rating'
                />
        </div>
        <h3>{review.title}</h3>
        <Link to={`/trips/${trip._id}`} className="review-trip">{destinationCity + " → " + originCity}</Link>
        <p className='light'>{review.body}</p>
        </div>
    )
}

export default ReviewItem;