import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { TripsItem } from '../Trips/TripsIndex/TripsItem';
import { fetchUser } from '../../store/users';
import defaultProfilePic from '../../assets/icons/user.png'
import './Profile.css'
import { fetchUserTrips } from '../../store/trips';

function Profile () {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const user = useSelector(state => state.users)
    const sessionUserId = useSelector(state => state.session.user._id)
    const trips = Object.values(useSelector(state => state.trips))

    useEffect(() => {
        dispatch(fetchUser(userId))
        dispatch(fetchUserTrips(userId));
    }, [dispatch, userId])

        return (
        <div className='profile-container'>
        <div className='profile-sidebar-container'>
            <img src={user.profilePicture ? user.profilePicture : defaultProfilePic}
            alt='profile-pic'
            className='large-icon'/>

            <div className='profile-rating-container'>
                <h2>{user.firstName}</h2>
                <h3>Driver Rating</h3>
                <h3>Passenger Rating</h3>
            </div>

            <div className='profile-bio-container'>
                <h3>About Me</h3>
                <p>{user.biography}</p>
                {sessionUserId === userId ? <Link to='/account'><button>Edit Bio</button></Link> : ""}
            </div>

            <div className='profile-journeys-container'></div>
                <h3>Journeys</h3>
                {(trips.length === 0 ) ?
                `${user.firstName} hasn't made any rides or trips yet!` :
                trips.map(trip => {
                    return (
                        <>
                            {(trip.driver !== undefined) ? <TripsItem key={trip._id} trip={trip} className='profile-trips'/> : ""}
                        </>
                    )
                })
                }
        </div>
        </div>
        );
}

export default Profile;