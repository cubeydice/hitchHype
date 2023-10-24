import { useDispatch } from "react-redux";
import NavBar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import { clearTripErrors, fetchTrips } from "../../store/trips";
import { TripsItem } from "./TripsItem";

export function Trips () {

    const dispatch = useDispatch();
    const trips = useDispatch(state => Object.values(state.trips.all));
    const [filteredTrips, setFilteredTrips] = useState();
    const [startPoint, setStartPoint] = useState();
    const [endPoint, setEndPoint] = useState();
    const [tripDate, setTripDate] = useState();

    const handleSearch = () => {
        e.preventDefault();
        let filtered = trips.filter( trip => trip.startPoint.toLowerCase().includes(startPoint) && trip.date === tripDate);
        // if(endPoint){

        // }
        setFilteredTrips(filtered)
    }

    useEffect(() => {
        dispatch(fetchTrips()) //.then( trips => setFilteredTrips(trips) )
        return () => dispatch(clearTripErrors());
    }, [dispatch])


    return (
        <div className="trip-page">
            <NavBar/>
            <div className="page-layout">
                <div className="search-bar">
                    <form className="search-form" onSubmit={ handleSearch }>
                        <input
                            type="text"
                            placeholder="Search start locations"
                            value={ startPoint }
                            onChange={ e => setStartPoint(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Destination (optional)"
                            value={ endPoint }
                            onChange={ e => setEndPoint(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Add trip date"
                            value={ tripDate }
                            onChange={ e => setTripDate(e.target.value)}
                        />
                        <button type="submit"> Search </button>
                    </form>
                </div>
                <div className="trip-page-header">
                    <h4>Trips leaving from start location</h4>
                </div>
                <div className="trip-items-container">
                { filteredTrips ? 
                (
                    filteredTrips.map(trip => (
                        <TripsItem key={trip._id} Trip={trip} />
                    ))
                ) : 
                (
                    trips.map(trip => (
                        <TripsItem key={trip._id} Trip={trip} />
                    ))
                )}
                </div>
            </div>
            <footer/>
        </div>
    )
}