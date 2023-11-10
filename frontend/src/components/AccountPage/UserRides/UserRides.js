import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserNavBar from "../../AccountNavBar/UserNavBar";
import { TripsItem } from "../../Trips/TripsIndex/TripsItem";
import { fetchUserRides } from "../../../store/trips";
import { ReactComponent as Loading} from "../../../assets/icons/loading-icon.svg"

export function UserRides () {
    const dispatch = useDispatch();
    const trips = Object.values(useSelector(state => state.trips))
    const user = useSelector(state => state.session.user)
    const [loaded, isLoaded] = useState(false);

    useEffect(() => {
        dispatch(fetchUserRides(user._id));
        setTimeout(()=>{isLoaded(true)}, 300);
    }, [dispatch, user._id])

    return(
        <div className="user-trips-layout">
            <div className="user-trips-container">
                <div className="user-trips-nav-container">
                    < UserNavBar />
                </div>
                <div >
                    <div className="user-trips-header-container">
                        <h3 className="user-trips-header-h3">Your Rides 🚌</h3>
                    </div>
                    <div className="user-trips-index-container">
                        { loaded && trips && !trips.empty ? (
                            trips.map(trip => (
                                <TripsItem key={trip._id} trip={trip} />
                        ))
                        ) : (
                            <Loading/>
                        )}
                        { loaded && trips.length === 0 ?
                        <p>You haven't joined any rides yet! Head over to our available trips and <Link to="/trips">hitch a ride</Link> today 😃</p> : ""}
                    </div>
                </div>
            </div>
        </div>
    )}