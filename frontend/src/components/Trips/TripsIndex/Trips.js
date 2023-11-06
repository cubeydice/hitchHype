import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearTripErrors, fetchTrips } from "../../../store/trips";
import { TripsItem } from "./TripsItem";
import "./Trips.css"
import { SearchBar } from "../../SearchBar/SearchBar";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";

export function Trips () {

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const searchRes = {}
    const trips = Object.values( useSelector(state => state.trips));
    const [searching, setSearching] = useState(false);
    const [filteredTrips, setFilteredTrips] = useState();
    const [filteredStart, setFilteredStart] = useState('All Trips');
    
    const handleClick = (e) => {
        e.preventDefault();
        setFilteredTrips();
        setFilteredStart("All Trips");
    }

    useEffect(() => {
        searching ? (
            // history.SearchBar
            // console.log("searching")
            console.log(searchRes)
            // handleSearch(searchRes)
            
            
        ) : (
            dispatch(fetchTrips())
        );
        dispatch(clearTripErrors());
    }, [dispatch, searching])

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
                console.log(location.state.search.tripDate)
    
                // console.log(tripDate.toLocaleString())
                // console.log(searchRes["tripDate"])
                // let inputDate = tripDate.toLocaleString("en-US", {
                //     timeZone: "America/Los_Angeles"
                //   })
                // // let checkDate = date.toLocaleString("en-US", {
                // //     timeZone: "America/Los_Angeles"
                // //   })
                // // console.log(new Date(tripDate))
                // // trips.filter( trip => console.log(new Date(trip.departureDate)));
                // filtered.filter( trip => {
                //     let checkDate = trip.date.toLocaleString("en-US", {
                //         timeZone: "America/Los_Angeles"
                //       })
                // });
    
                // filtered = trips.filter( trip =>  console.log(trip.departureDate.slice(12)));//new Date(trip.departureDate) == new Date(tripDate));
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
                        <SearchBar searchRes={searchRes} fromIndex={true} setSearching={setSearching} />
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