import StarRatings from 'react-star-ratings';
import './ReviewItem.css'

const ReviewItem = ({review}) => {
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
        <p className='light'>{review.body}</p>
        </div>
    )
}

export default ReviewItem;