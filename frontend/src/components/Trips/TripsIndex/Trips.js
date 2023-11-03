import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearTripErrors, fetchTrips } from "../../../store/trips";
import { TripsItem } from "./TripsItem";
import "./Trips.css"

export function Trips () {

    const dispatch = useDispatch();
    const trips = Object.values( useSelector(state => state.trips));
    const [filteredTrips, setFilteredTrips] = useState();
    const [startPoint, setStartPoint] = useState();
    const [endPoint, setEndPoint] = useState();
    const [tripDate, setTripDate] = useState();
    const [filteredStart, setFilteredStart] = useState('All Trips');
    // const [fetchedTrips, setFetchedTrips] = useState(false);
    

    const handleSearch = (e) => {
        e.preventDefault();
        // console.log(startPoint)
        // console.log(endPoint)
        // console.log(new Date(tripDate).toDateString())
        let filtered = trips.filter( trip => trip.origin.toLowerCase().includes(startPoint.toLowerCase())); // && trip.date === tripDate);
        if(endPoint){
            filtered = trips.filter( trip => trip.destination.toLowerCase().includes(endPoint.toLowerCase()));
        }
        if(tripDate){
            // console.log(tripDate.toLocaleString())
            console.log(tripDate)
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

            filtered = trips.filter( trip =>  console.log(trip.departureDate.slice(12)));//new Date(trip.departureDate) == new Date(tripDate));
        }
        startPoint === "" ? (setFilteredStart("All Trips")) : (setFilteredStart(`Trips leaving from ${startPoint}`)); 
        // setFilteredStart(`Trips leaving from ${startPoint}.`)
        setFilteredTrips(filtered)
    }

    useEffect(() => {
        dispatch(fetchTrips());
        // setFetchedTrips(true);
        dispatch(clearTripErrors());
    }, [dispatch])

   return (
        <>
            { trips ? (
                <div className="trip-page">
                <div className="page-layout">
                    <div className="search-bar">
                        <form className="search-form" id="trip-index-search" onSubmit={ handleSearch }>
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
                                type="date" 
                                value={tripDate}
                                onChange={(e) => setTripDate(e.target.value)}
                            />
                            <button type="submit"> Search </button>
                        </form>
                    </div>
                    <div className="trip-page-header">
                        {/* <h3>Trips leaving from start location</h3> */}
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
                        // <></>
                     )}
                    </div>
                </div>
            </div>
            ) : (
                <></>
            )}
        </>
       
    )
}