import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Passenger } from "../Passenger/Passenger";
import { useDispatch, useSelector } from "react-redux";
import { clearTripErrors, deleteTrip, fetchTrip, updateTrip } from "../../../store/trips";
import { useEffect, useState } from "react";
import "./DriverTripUpdate.css"


export function DriverUpdateForm () {
    const { tripId } = useParams();
    // console.log(tripId)
    const dispatch = useDispatch();
    const history = useHistory();
    const trip = useSelector(state => state.trips);
    const [availableSeats, setAvailableSeats] = useState()
    const tripsPage = "/trips/"
    let passengersArr;
    let seats;
    // const sesionUser = useSelector(state => state.session.user);

    useEffect( () => {
        dispatch(fetchTrip(tripId)).then( trip => setAvailableSeats(trip.availableSeats - trip.passengers.length));   //.then( trip => console.log(trip))
        dispatch(clearTripErrors());
    }, [dispatch])

    const handleClick = field => (e) => {
        e.preventDefault();
        console.log(e.target.value)
        switch (field) {
            case "deletePassenger":
                passengersArr = trip.passengers.filter((payload) => (payload._id !== e.target.value))
                dispatch(updateTrip({...trip, passengers: passengersArr})).then( history.push(`/trips/${tripId}`) )
                
                break;
            case "deleteTrip":
                dispatch(deleteTrip(tripId)).then( res =>{
                    console.log(res);
                     history.push('/trips')
                    })
                break;
            case "addSeat":
                seats = availableSeats + 1 > 5 ? availableSeats + 1 : availableSeats
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
                <div className="Driver-update-page-layout">
                    <div className="Driver-update-header">
                        <h3 className="Driver-update-header-h3">Update your trip!</h3>
                    </div>
                    <div className="Driver-update-map-container">
                        <div className="map-api">Map Api</div>
                    </div>
                    <div className="Driver-update-passengers-container">
                        <div className="Driver-update-available-seats">
                            <h3 className="Driver-update-header-h3">Available seats: {availableSeats}</h3>
                            <button className="Driver-update-available-seats-btn" onClick={handleClick("addSeat")}>+</button>
                            <button className="Driver-update-available-seats-btn" onClick={handleClick("subtractSeat")}>−</button>
                        </div>

                        <div className="Driver-update-passengers-header">
                            <h3 className="Driver-update-header-h3">Passengers</h3>
                        </div>
                        <div className="Driver-update-passengers-items">
                            {trip.passengers.map( passenger => (
                                <>
                                    <Passenger key={passenger.passenger._id} passenger={passenger} className="Driver-update-passenger-item"/>
                                    <div className="Driver-update-rmv-passenger-container">
                                        <button id="Driver-update-rmv-passenger" value={passenger._id} onClick={handleClick("deletePassenger")}>Remove passenger</button>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                    <div className="Driver-update-edit-btns">
                        <button className="Driver-update-btn" onClick={handleClick("updateTrip")}>Submit changes</button>
                        <button className="Driver-update-btn" onClick={handleClick("deleteTrip")}>Delete trip</button>
                    </div>
                </div>
                // <></>
            ) : (
                <></>
            )}
        </>
    )
}