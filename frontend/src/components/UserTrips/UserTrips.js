import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchUserTrips } from "../../store/trips";
// import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { TripsItem } from "../Trips/TripsIndex/TripsItem";
import "./UserTrips.css"
import UserNavBar from "../AccountNavBar/UserNavBar";
export function UserTrips () {

    const dispatch = useDispatch();
    const trips = Object.values(useSelector(state => state.trips))
    const user = useSelector(state => state.session.user)
    // const userId = useParams();

    useEffect(() => {
        dispatch(fetchUserTrips(user._id)).then(res => console.log(res));
    }, [dispatch])

    return (
    <div className="user-trips-layout">

        <div className="user-trips-container">
            <div className="user-trips-nav-container">
                < UserNavBar/>
            </div>
            <div >
                <div className="user-trips-header-container">
                    <h3 className="user-trips-header-h3">Your Trips 🗺️</h3>
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