import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Passenger } from "../Passenger/Passenger";
import { useDispatch, useSelector } from "react-redux";
import { clearTripErrors, fetchTrip } from "../../../store/trips";
import { useEffect } from "react";
import "./DriverTripUpdate.css"


export function DriverUpdateForm () {
    const { tripId } = useParams();
    console.log(tripId)
    const dispatch = useDispatch();
    const trip = useSelector(state => state.trips);
    // const sesionUser = useSelector(state => state.session.user);

    useEffect( () => {
        dispatch(fetchTrip(tripId));   //.then( trip => console.log(trip))
        dispatch(clearTripErrors());
    }, [dispatch])


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
                        <div className="Driver-update-passengers-header">
                            <h3 className="Driver-update-header-h3">Passengers</h3>
                        </div>
                        <div className="Driver-update-passengers-items">
                            {trip.passengers.map( passenger => (
                                <>
                                    <Passenger key={passenger.passenger._id} passenger={passenger} className="Driver-update-passenger-item"/>
                                    <div className="Driver-update-rmv-passenger-container">
                                        <button id="Driver-update-rmv-passenger">Remove passenger</button>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                    <div className="Driver-update-edit-btns">
                        <button className="Driver-update-btn">Save changes</button>
                        <button className="Driver-update-btn">Delete trip</button>
                    </div>
                </div>
                // <></>
            ) : (
                <></>
            )}
        </>
    )
}