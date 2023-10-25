
import map from "../../../assets/images/map-dummy.jpg"
import linearMap from "../../../assets/images/linear-map-dummy.jpg"
import "./DriverTripShow.css"
import { Passenger } from '../Passenger/Passenger';

export function DriverTripShow ({ trip }) {
    const date = new Date(trip.departureDate);

    return (
        <div>
            {trip.driver ? (
                <>
                    <div className='trip-show-details'>
                        <div className='trip-show-info'>

                            <div className='trip-show-points-container'>
                                <div className='trip-show-endPoint'>
                                    <h3 id='trip-show-points'>{trip.origin.city}</h3>
                                </div>
                                <div>
                                    <h3 id='trip-show-points'>→</h3>
                                </div>
                                <div className='trip-show-StartPoint'>
                                    <h3 id='trip-show-points'>{trip.destination.city}</h3>
                                </div>
                            </div>
                            <div>
                                <div className='trip-show-passangers-ammount'>
                                    <h3>Current amount of passengers: {trip.passengers.length}</h3>
                                </div>
                                <div className='trip-show-spots'>
                                    <h3>The amount of seats left: {trip.availableSeats}</h3>
                                </div>
                                <div className='trip-show-departure-time'>
                                    <h3>Trip will take place on {date.toDateString()}.</h3>
                                </div>
                            </div>
                            <div className='trip-show-edit-btn-container'>
                                <a href='' className='trip-show-edit-btn'> 
                                    <div className='edit-btn-container'>
                                        <h3>Edit trip</h3>
                                    </div>
                                </a>
                            </div>

                        </div>
                        <div className='trip-show-map'>
                        <img src={map} alt="show-img" id='show-img'/>
                        </div>
                    </div>
                    <div className='trip-show-address-details-and-linear-map'>
                        <div className='trip-show-address-details-container'>
                            <div className='trip-show-address'>
                                <div className='trips-show-address-display'>
                                    <h3 id='header'>Start Address</h3>
                                    <h3>{trip.origin.street}</h3>
                                    <h3>{trip.origin.city}, {trip.origin.state} {trip.origin.postalCode}</h3>
                                </div>
                                <div className='trips-show-address-display'>
                                    <h3 id='header'>Destination Address</h3>
                                    <h3>{trip.destination.street}</h3>
                                    <h3>{trip.destination.city}, {trip.destination.state} {trip.destination.postalCode}</h3>
                                </div>
                            </div>
                            <div className='trip-show-passengers'>
                                <h3 id='header'>Passengers</h3>
                                {trip.passengers.map( passenger => (
                                    <Passenger key={passenger._id} passenger={passenger}/>
                                ))}
                            </div>
                        </div>
                        <div className='trip-show-linear-map'>
                            <img src={linearMap} alt="show-img" id='show-linear-map-img'/>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}

        </div>
    )
}