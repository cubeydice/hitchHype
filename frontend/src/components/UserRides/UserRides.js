import { useDispatch, useSelector } from "react-redux";
import UserNavBar from "../AccountNavBar/UserNavBar";
import { TripsItem } from "../Trips/TripsIndex/TripsItem";
import { fetchUserRides } from "../../store/trips";
import { useEffect } from "react";

export function UserRides () {
    const dispatch = useDispatch();
    const trips = Object.values(useSelector(state => state.trips))
    const user = useSelector(state => state.session.user)
    useEffect(() => {
        dispatch(fetchUserRides(user._id)).then(res => console.log(res));
    }, [dispatch])


    return( 
        <div className="user-rider-layout">

        <div className="user-trips-container">
            <div className="user-trips-nav-container">
                < UserNavBar />
            </div>
            <div >
                <div className="user-trips-header-container">
                    <h3 className="user-trips-header-h3">Your Rides 🚌</h3>
                </div>
                <div className="user-trips-index-container">
                    { trips.map(trip => (
                        <TripsItem key={trip._id} trip={trip} />
                    ))}
                </div>
            </div>
        </div>
    </div>
    )
}