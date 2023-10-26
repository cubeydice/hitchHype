import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Passenger } from "../Passenger/Passenger";
import { useDispatch, useSelector } from "react-redux";
import { clearTripErrors, deleteTrip, fetchTrip } from "../../../store/trips";
import { useEffect } from "react";
import "./DriverTripUpdate.css"


export function DriverUpdateForm () {
    const { tripId } = useParams();
    // console.log(tripId)
    const dispatch = useDispatch();
    const history = useHistory();
    const trip = useSelector(state => state.trips);
    const tripsPage = "/trips/"
    // const sesionUser = useSelector(state => state.session.user);

    useEffect( () => {
        dispatch(fetchTrip(tripId));   //.then( trip => console.log(trip))
        dispatch(clearTripErrors());
    }, [dispatch])

    const handleClick = (e) => {
        // console.log(e.target.value)
        e.target.value === "delete" ? (
            dispatch(deleteTrip(tripId)).then( res => history.push('/trips'))
            // console.log(e.target.value)
        ) : (
            console.log(e.target.value)
        );
    }

    return (
        <>
            { trip.passengers ? (
                <div className="driver-update-page-layout">
                    <div className="driver-update-header">
                        <h3 className="driver-update-header-h3">Update your trip!</h3>
                    </div>
                    <div className="driver-update-map-container">
                        <div className="map-api">Map Api</div>
                    </div>
                    <div className="driver-update-passengers-container">
                        <div className="driver-update-passengers-header">
                            <h3 className="driver-update-header-h3">Passengers</h3>
                        </div>
                        <div className="driver-update-passengers-items">
                            {trip.passengers.map( passenger => (
                                <>
                                    <Passenger key={passenger.passenger._id} passenger={passenger} className="Driver-update-passenger-item"/>
                                    <div className="driver-update-rmv-passenger-container">
                                        <button id="driver-update-rmv-passenger" value={passenger._id} onClick={handleClick}>Remove passenger</button>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                    <div className="driver-update-edit-btns">
                        {/* <button className="Driver-update-btn" onClick={handleClick} value="save">Save changes</button> */}
                        <button className="driver-update-btn" onClick={handleClick} value="delete">Delete trip</button>
                    </div>
                </div>
                // <></>
            ) : (
                <></>
            )}
        </>
    )
}