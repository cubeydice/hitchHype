import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { TripsItem } from '../Trips/TripsIndex/TripsItem';
import { fetchUser } from '../../store/users';
import DefaultProfilePic from '../../assets/icons/user.png'
import './Profile.css'

function Profile ({defaultPic}) {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const user = useSelector(state => state.users)
    console.log(user)

    useEffect(() => {
        dispatch(fetchUser(userId))
    }, [dispatch, userId])

        return (
        <>
        <div className='profile-sidebar-container'>
            <img src={user.profilePicture ? user.profilePicture : DefaultProfilePic}
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
            </div>

            <div className='profile-journeys-container'></div>
                <h3>Journeys</h3>
                {(!user.rides || !user.trips || (user.trips.length === 0 && user.rides.length === 0)) ?
                `${user.firstName} hasn't made any rides or trips yet!` :
                user.trips.map(trip => {
                    return (
                        <>
                            <TripsItem key={trip._id} trip={trip} className='profile-trips'/>
                        </>
                    )
                })
                }
        </div>
        </>
        );
}

export default Profile;