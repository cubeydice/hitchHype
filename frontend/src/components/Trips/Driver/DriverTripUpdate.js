import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Passenger } from "../Passenger/Passenger";
import { useDispatch, useSelector } from "react-redux";
import { clearTripErrors, deleteTrip, fetchTrip, updateTrip } from "../../../store/trips";
import { useEffect, useState } from "react";
import "./DriverTripUpdate.css"
import explodeAddress from "../AddressParser";


export function DriverUpdateForm () {
    const { tripId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const trip = useSelector(state => state.trips);
    const [availableSeats, setAvailableSeats] = useState()
    let tripOrigin;
    let tripDestination;
    let passengersArr;
    let seats;

    explodeAddress(trip.origin, function(err,addressStr){
        tripOrigin = (addressStr.city);
    })
    explodeAddress(trip.destination, function(err,addressStr){
        tripDestination = (addressStr.city);
    })

    useEffect( () => {
        dispatch(fetchTrip(tripId)).then( trip => setAvailableSeats(trip.availableSeats - trip.passengers.length)); 
        dispatch(clearTripErrors());
    }, [dispatch, tripId])

    const handleClick = field => (e) => {
        e.preventDefault();

        switch (field) {
            case "deletePassenger":
                passengersArr = trip.passengers.filter((payload) => (payload._id !== e.target.value))
                dispatch(updateTrip({...trip, passengers: passengersArr})).then( history.push(`/trips/${tripId}`) )

                break;
            case "deleteTrip":
                dispatch(deleteTrip(tripId)).then( res =>{

                     history.push('/trips')
                    })
                break;
            case "addSeat":
                seats = availableSeats + 1 < 5 - trip.passengers.length? availableSeats + 1 : availableSeats
                setAvailableSeats(seats)
                break;
            case "subtractSeat":
                seats = availableSeats - 1 > 0 ? availableSeats - 1 : 0
                setAvailableSeats(seats)
                break;
            case "updateTrip":
                dispatch(updateTrip({...trip, availableSeats: (availableSeats + trip.passengers.length)})).then( history.push(`/trips/${tripId}`) )
                break;
            default:
                break;
        }

    }

    return (
        <>
            { trip.passengers ? (
                <div className="driver-update-page-layout">
                    <div className="driver-update-header">
                        <h3 className="driver-update-header-h3">Update your trip from <span id="trip-places">{tripOrigin}</span> to <span id="trip-places">{tripDestination}</span>!</h3>
                    </div>
                    <div className="driver-update-map-container">
                        <div className="map-api">Map Api</div>
                    </div>
                    <div className="edit-container">
                        <div className="driver-update-passengers-container">
                            <div className="driver-update-available-seats">
                                <h3 className="driver-update-header-h3">Available seats: {availableSeats}</h3>
                                <button className="driver-update-available-seats-btn" onClick={handleClick("addSeat")}>+</button>
                                <button className="driver-update-available-seats-btn" onClick={handleClick("subtractSeat")}>−</button>
                            </div>
                            <div className="passengers-edit-container"> 
                                <div className="driver-update-passengers-header">
                                    {trip.passengers.length > 0 ? (
                                        <h3 className="driver-update-header-h3">Passengers</h3>
                                    ) : (
                                        <h3 className="driver-update-header-h3">No Passengers</h3>
                                    )}
                                </div>
                                <>
                                    {trip.passengers.map( passenger => (
                                        <div className="passenger-item-container">
                                            <Passenger key={passenger.passenger._id} passenger={passenger} className="Driver-update-passenger-item"/>

                                            <div className="driver-update-rmv-passenger-container">
                                                <button id="driver-update-rmv-passenger" value={passenger._id} onClick={handleClick("deletePassenger")}>Remove passenger</button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            </div>
                        </div>
                        <div className="driver-update-edit-btns">
                            <button className="driver-update-btn" onClick={handleClick("updateTrip")}>Submit changes</button>
                            <button className="driver-update-btn" onClick={handleClick("deleteTrip")}>Delete trip</button>
                        </div>
                    </div>

                </div>
                // <></>
            ) : (
                <></>
            )}
        </>
    )
}