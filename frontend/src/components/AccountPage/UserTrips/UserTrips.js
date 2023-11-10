import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { fetchUserTrips } from "../../../store/trips";
import { TripsItem } from "../../Trips/TripsIndex/TripsItem";
import UserNavBar from "../../AccountNavBar/UserNavBar";
import { ReactComponent as Loading} from "../../../assets/icons/loading-icon.svg"
import "./UserTrips.css"

export function UserTrips () {

    const dispatch = useDispatch();
    const trips = Object.values(useSelector(state => state.trips))
    const user = useSelector(state => state.session.user)
    const [loaded, isLoaded] = useState(false);

    useEffect(() => {
        dispatch(fetchUserTrips(user._id));
        setTimeout(()=>{isLoaded(true)}, 300);
    }, [dispatch, user._id])

    return (
    <div className="user-trips-layout">

        <div className="user-trips-container">
            <div className="user-trips-nav-container">
                < UserNavBar/>
            </div>
            <div className="journey-page">
                <div className="user-trips-header-container">
                    <h3 className="user-trips-header-h3">Your Trips 🗺️</h3>
                </div>
                <div className="user-trips-index-container">
                    { loaded && trips && !trips.empty ? (
                        trips.map(trip => (
                            <TripsItem key={trip._id} trip={trip} />
                       ))
                    ) : (
                        <Loading/>
                    )}
                    { loaded && trips.length === 0 ? <p>You haven't made any trips yet! <Link to="/trips/new">Make a trip today</Link> 😃</p> : ""}
                </div>
            </div>
        </div>
    </div>
    )
}