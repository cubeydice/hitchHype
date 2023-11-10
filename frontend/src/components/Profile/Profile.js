import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import StarRatings from 'react-star-ratings';
import { fetchUser } from '../../store/users';
import { fetchUserTrips } from '../../store/trips';
import { TripsItem } from '../Trips/TripsIndex/TripsItem';
import ReviewItem from '../Reviews/ReviewItem/ReviewItem';
import { ReactComponent as Loading } from '../../assets/icons/loading-icon.svg'
import defaultProfilePic from '../../assets/icons/user.png'
import './Profile.css'

function Profile () {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const user = useSelector(state => state.users.user)
    const sessionUserId = useSelector(state => state.session.user._id)
    const trips = Object.values(useSelector(state => state.trips))
    const reviews = useSelector(state => state.users.reviewee)
    const rating = useSelector(state => state.users.avgRating)

    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(fetchUser(userId))
        dispatch(fetchUserTrips(userId));
    }, [dispatch, userId])

    const avgReview = (passenger) => {
        const aggReviews = reviews.filter(review => review.isDriver === passenger)
        const avgReview = aggReviews.reduce((total, next) =>
                            total + next.rating, 0)
                            / aggReviews.length
        return avgReview
    }

    if (!user) return <div className='loading-page-container'><Loading/></div>
    return (
    <div className='profile-container'>
        <div className='profile-sidebar-container'>
            <img src={user ? user.profilePicture : defaultProfilePic}
            alt='profile-pic'
            className='large-icon'/>

            <div className='profile-rating-container'>
                <h2>{user.firstName}</h2>
                <StarRatings
                    rating={rating}
                    starRatedColor="#e8ae42"
                    starDimension="24px"
                    className='rating'
                />
                {avgReview(false) ?
                    <h3>Driver Rating: <span className='light'>
                        {Math.round(avgReview(false) * 100)/100}</span></h3>
                : ""}

                {avgReview(true) ?
                    <h3>Passenger Rating: <span className='light'>
                        {Math.round(avgReview(true)*100)/100}</span></h3>
                : ""}
            </div>

            <div className='profile-bio-container'>
                <h3>About Me</h3>
                <p className='light'>{user.biography}</p>
                {sessionUserId === userId ? <Link to='/account'><button>Edit Bio</button></Link> : ""}
            </div>

            <h3>Journeys</h3>
            <div className='profile-journeys-container'>
                <div className='profile-journeys'>
                {(trips.length === 0 ) ?
                `${user.firstName} hasn't made any rides or trips yet!` :
                trips.map(trip => {
                    return (
                        <>
                            {
                                (trip.driver !== undefined) ?
                                <TripsItem
                                    key={trip._id} trip={trip}
                                    className='profile-trips'/>
                                : ""
                            }
                        </>
                    )
                })
                }
                </div>
            </div>
        </div>

        <div className='profile-reviews-container'>
            <div>
                <h2>Driver Reviews</h2>
                <div className='profile-reviews'>
                {reviews.map(review => {
                    if (!review.isDriver) return <ReviewItem
                                                    review={review}
                                                    key={review._id}/>
                    else return null;
                })}
                </div>
            </div>
            <div>
                <h2>Rider Reviews</h2>
                <div className='profile-reviews'>
                {reviews.map(review => {
                    if (review.isDriver) return <ReviewItem
                                                    review={review}
                                                    key={review._id}/>
                    else return null;
                })}
                </div>
            </div>
        </div>
    </div>
        );
}

export default Profile;