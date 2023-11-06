import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearTripErrors, fetchTrips } from "../../../store/trips";
import { TripsItem } from "./TripsItem";
import "./Trips.css"
import { SearchBar } from "../../SearchBar/SearchBar";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";

export function Trips ({ searchRes = {} }) {

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const trips = Object.values( useSelector(state => state.trips));
    const [searching, setSearching] = useState(false);
    const [filteredTrips, setFilteredTrips] = useState();
    const [filteredStart, setFilteredStart] = useState('All Trips');
    

    if(location.search){

        let filtered;
        // if(searchRes["startPoint"]){
        //     filtered = trips.filter( trip => trip.origin.toLowerCase().includes(searchRes["startPoint"].toLowerCase())); // && trip.date === tripDate);
        // }
        // if(searchRes["endPoint"]){
        //     filtered = trips.filter( trip => trip.destination.toLowerCase().includes(searchRes["endPoint"].toLowerCase()));
        // }
        // if(searchRes["tripDate"]){
        //     // console.log(tripDate.toLocaleString())
        //     console.log(searchRes["tripDate"])
        //     // let inputDate = tripDate.toLocaleString("en-US", {
        //     //     timeZone: "America/Los_Angeles"
        //     //   })
        //     // // let checkDate = date.toLocaleString("en-US", {
        //     // //     timeZone: "America/Los_Angeles"
        //     // //   })
        //     // // console.log(new Date(tripDate))
        //     // // trips.filter( trip => console.log(new Date(trip.departureDate)));
        //     // filtered.filter( trip => {
        //     //     let checkDate = trip.date.toLocaleString("en-US", {
        //     //         timeZone: "America/Los_Angeles"
        //     //       })
        //     // });

        //     filtered = trips.filter( trip =>  console.log(trip.departureDate.slice(12)));//new Date(trip.departureDate) == new Date(tripDate));
        // }
        // searchRes["startPoint"] === "" ? (setFilteredStart("All Trips")) : (setFilteredStart(`Trips leaving from ${searchRes["startPoint"]}`)); 
        // // setFilteredStart(`Trips leaving from ${startPoint}.`)
        // setFilteredTrips(filtered)
        
    }
    const handleSearch = () => {
        // e.preventDefault();
        //\
    }

    useEffect(() => {
        searching ? (
            // history.SearchBar
            console.log("searching")
            
        ) : (
            dispatch(fetchTrips())
            // .then( () => handleSearch())
        );
        dispatch(clearTripErrors());
    }, [dispatch, searching])

   return (
        <>
            { trips ? (
                <div className="trip-page">
                <div className="page-layout">
                    <div className="search-bar">
                        <SearchBar searchRes={searchRes} fromIndex={true} setSearching={setSearching}/>

                        {/* <form className="search-form" id="trip-index-search" onSubmit={ handleSearch }>
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
                        </form> */}

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