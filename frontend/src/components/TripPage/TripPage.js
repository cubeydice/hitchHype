import { useDispatch } from "react-redux";
import NavBar from "../NavBar/NavBar";
import { useEffect } from "react";
import { clearTripErrors, fetchTrips } from "../../store/trips";
import { TripItem } from "./TripItem";

function TripPage () {

    const dispatch = useDispatch();
    const trips = useDispatch(state => Object.values(state.trips.all))

    useEffect(() => {
        dispatch(fetchTrips());
        return () => dispatch(clearTripErrors());
    }, [dispatch])


    return (
        <div className="trip-page">
            <NavBar/>
            <div className="page-layout">
                <div className="search-bar">

                </div>
                <div className="trip-page-header">

                </div>
                <div className="trip-items-container">
                {trips.map(trip => (
                    <TripItem key={trip._id} Trip={Trip} />
                ))}
                </div>
            </div>
            <footer/>
        </div>
    )
}