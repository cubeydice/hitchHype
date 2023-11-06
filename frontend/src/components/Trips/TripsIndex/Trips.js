import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearTripErrors, fetchTrips } from "../../../store/trips";
import { TripsItem } from "./TripsItem";
import "./Trips.css"
import { SearchBar } from "../../SearchBar/SearchBar";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export function Trips () {

    const dispatch = useDispatch();
    const location = useLocation();
    const trips = Object.values( useSelector(state => state.trips));
    const [searchRes, setSearchRes] = useState({"startPoint": "", "endPoint":"", "tripDate":""})
    const [searching, setSearching] = useState(false);
    const [filteredTrips, setFilteredTrips] = useState();
    const [filteredStart, setFilteredStart] = useState('All Trips');
    
    const handleClick = (e) => {
        e.preventDefault();
        setFilteredTrips();
        setFilteredStart("All Trips");
    }

    useEffect(() => {
        dispatch(fetchTrips())
        dispatch(clearTripErrors());
    }, [dispatch])

    useEffect(() => {
        // console.log("searching")
        // console.log(searchRes)
        let filtered;
            if(searchRes.startPoint){
                filtered = trips.filter( trip => trip.origin.toLowerCase().includes(searchRes.startPoint.toLowerCase())); // && trip.date === tripDate);
    
            }
            if(searchRes.endPoint){
                filtered = filtered.filter( trip => trip.destination.toLowerCase().includes(searchRes.endPoint.toLowerCase()));
    
            }
            if(searchRes.tripDate){
                filtered.filter( trip => trip.departureDate === searchRes.tripDate);
                // let checkDate = trip.date.toLocaleString("en-US", {
                //     timeZone: "America/Los_Angeles"
                //   })
    
            }
            
            searchRes.startPoint === "" ? (setFilteredStart("All Trips")) : (setFilteredStart(`Trips leaving from ${searchRes.startPoint}`)); 
            setFilteredTrips(filtered)

        setSearching(false)
    }, [searching])

    useEffect(() => {
        let filtered;
        if(location.state){
            if(location.state.search.startPoint){
                filtered = trips.filter( trip => trip.origin.toLowerCase().includes(location.state.search.startPoint.toLowerCase())); // && trip.date === tripDate);
    
            }
            if(location.state.search.endPoint){
                filtered = filtered.filter( trip => trip.destination.toLowerCase().includes(location.state.search.endPoint.toLowerCase()));
    
            }
            if(location.state.search.tripDate){
                filtered.filter( trip => trip.departureDate === location.state.search.tripDate);
            }
            
            location.state.search.startPoint === "" ? (setFilteredStart("All Trips")) : (setFilteredStart(`Trips leaving from ${location.state.search.startPoint}`)); 
            setFilteredTrips(filtered)
        }

    }, [location.state])

   return (
        <>
            { trips ? (
                <div className="trip-page">
                <div className="page-layout">
                    <div className="search-bar">
                        <SearchBar searchRes={searchRes} setSearchRes={setSearchRes} fromIndex={true} setSearching={setSearching} id="searchBar"/>
                    </div>
                    <div className="trip-page-header">
                        <h3>
                            {filteredStart}
                        </h3>
                    </div>
                    <div className="trip-items-container">
                    { filteredTrips ? 
                    (
                        filteredTrips.map(trip => (
                            <TripsItem key={trip._id} trip={trip} />
                        ))
                    ) : 
                    (
                        trips.map(trip => (
                            <TripsItem key={trip._id} trip={trip} />
                        ))
                     )}
                    </div>
                    <div className="show-all-trips-btn">
                        { filteredTrips ? (
                            <button onClick={handleClick}>All Trips</button>
                        ) : (<></>) }
                    </div>
                </div>
            </div>
            ) : (
                <></>
            )}
        </>
       
    )
}