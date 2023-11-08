import { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Passenger } from '../Passenger/Passenger';
import { ReactComponent as PassengerIcon } from '../../../assets/icons/Trips/person.svg'
import { ReactComponent as SeatIcon } from '../../../assets/icons/Trips/seat.svg'
import explodeAddress from "../AddressParser"
import RouteShow from "../../RouteShow/RouteShow";
import CarbonEmissions from "../../CarbonEmissions";
import "./DriverTripShow.css"

export function DriverTripShow({ trip }) {
    const availableSeats = (trip.passengers ? (trip.availableSeats - trip.passengers.length) : (null));
    const date = new Date(trip.departureDate);
    const todaysDate =  new Date();
    const [tripOver, setTripOver] = useState(todaysDate > date);
    let destination = {
        city: "",
        state: "",
        country: "",
        postalCode: "",
        streetAddress: ""
    };
    let origin = {
        city: "",
        state: "",
        country: "",
        postalCode: "",
        streetAddress: ""
    };

    explodeAddress(trip.destination, function(err,addressStr)
    {
        destination["city"] = addressStr.city;
        destination["state"] = addressStr.state;
        destination["country"] = addressStr.country;
        destination["postalCode"] = addressStr.postal_code;
        destination["streetAddress"] = addressStr.street_address1;
    })
    explodeAddress(trip.origin, function(err,addressStr)
    {
        origin["city"] = addressStr.city;
        origin["state"] = addressStr.state;
        origin["country"] = addressStr.country;
        origin["postalCode"] = addressStr.postal_code;
        origin["streetAddress"] = addressStr.street_address1;
    })

    return (
        <div>
            {trip.driver ? (
                <>
                    <div className='trip-show-details'>
                        <div className='trip-show-info'>
                            <div className='trip-show-points-container'>
                                <div className='trip-show-startPoint'>
                                    <h1 id='trip-show-points'>{origin.city}</h1>
                                </div>
                                <div>
                                    <h3 id='trip-show-points'>→</h3>
                                </div>
                                <div className='trip-show-endPoint'>
                                    <h1 id='trip-show-points'>{destination.city}</h1>
                                </div>
                            </div>

                            <div>
                                <div className='trip-show-passangers-amount'>
                                    <h3 id="trip-seats-time-details"># of passengers:</h3>
                                    <div>{Array(trip.passengers.length).fill(true).map((_, i) => <PassengerIcon key={i} className="medium-icon"/>)}</div>
                                </div>
                                <div className='trip-show-seats-amount'>
                                    <h3 id="trip-seats-time-details">Seats left:</h3>
                                    <div>{Array(availableSeats).fill(true).map((_, i) => <SeatIcon key={i} className="medium-icon"/>)}</div>
                                </div>
                                <div className='trip-show-departure-time'>
                                    <h3 id="trip-seats-time-details">Date of trip: {date.toDateString()}</h3>
                                </div>
                            </div>

                            <div className='trip-show-edit-btn-container'>
                                { tripOver ? (
                                    <button className='edit-btn-container' disabled>
                                        <h3>Trip Over</h3>
                                    </button>
                                ) : (

                                    <Link to={`/trips/${trip._id}/update`} className='trip-show-edit-btn'>
                                        <button className='edit-btn-container'>
                                            <h3>Edit trip</h3>
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className='trip-show-map'>
                            <RouteShow trip={trip}/>
                        </div>
                    </div>

                    <div className='trip-show-address-details-and-ce'>
                        <div className='trip-show-address-details-container'>
                            <div className='trip-show-address'>
                                <div className='trips-show-address-display'>
                                    <h3 id='header'>Start Address</h3>
                                    <h3 id='non-header'>{origin.streetAddress}</h3>
                                    <h3 id='non-header'>{origin.city}{(origin.city && origin.state) ? ',' : ''} {origin.state} {origin.postalCode}</h3>
                                </div>
                                <div className='trips-show-address-display'>
                                    <h3 id='header'>Destination Address</h3>
                                    <h3 id='non-header'>{destination.streetAddress}</h3>
                                    <h3 id='non-header'>{destination.city}{(destination.city && destination.state) ? ',' : ''} {destination.state} {destination.postalCode}</h3>
                                </div>
                            </div>
                            <div className='trip-show-passengers'>
                                <h2 id='header'>Passengers</h2>
                                {trip.passengers.map( passenger => (
                                    <Passenger key={passenger.passenger._id} passenger={passenger}/>
                                ))}
                            </div>
                        </div>
                        <div className='trip-show-ce'>
                            <CarbonEmissions trip={trip} driver={true}/>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}

        </div>
    )
}