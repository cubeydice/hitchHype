import linearMap from "../../../assets/images/linear-map-dummy.jpg"
import "./DriverTripShow.css"
import { Passenger } from '../Passenger/Passenger';
import explodeAddress from "../AddressParser"
import RouteShow from "../../RouteShow/RouteShow";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import CarbonEmissions from "../../CarbonEmissions";


export function DriverTripShow({ trip }) {
    const availableSeats = (trip.passengers ? (trip.availableSeats - trip.passengers.length) : (null));
    const date = new Date(trip.departureDate);
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
                                <div className='trip-show-endPoint'>
                                    <h3 id='trip-show-points'>{origin.city}</h3>
                                </div>
                                <div>
                                    <h3 id='trip-show-points'>→</h3>
                                </div>
                                <div className='trip-show-StartPoint'>
                                    <h3 id='trip-show-points'>{destination.city}</h3>
                                </div>
                            </div>
                            <div>
                                <div className='trip-show-passangers-ammount'>
                                    <h3>Current amount of passengers: {trip.passengers.length}</h3>
                                </div>
                                <div className='trip-show-spots'>
                                    <h3>The amount of seats left: {availableSeats}</h3>
                                </div>
                                <div className='trip-show-departure-time'>
                                    <h3>Trip will take place on {date.toDateString()}.</h3>
                                </div>
                            </div>
                            <div className='trip-show-edit-btn-container'>
                                <Link to={`/trips/${trip._id}/update`} className='trip-show-edit-btn'>
                                    <button className='edit-btn-container'>
                                        <h3>Edit trip</h3>
                                    </button>
                                </Link>
                            </div>

                        </div>
                        <div className='trip-show-map'>
                            <RouteShow trip={trip}/>
                        </div>
                    </div>
                    <div className='trip-show-address-details-and-linear-map'>
                        <div className='trip-show-address-details-container'>
                            <div className='trip-show-address'>
                                <div className='trips-show-address-display'>
                                    <h3 id='header'>Start Address</h3>
                                    <h3>{origin.streetAddress}</h3>
                                    <h3>{origin.city}{(origin.city && origin.state) ? ',' : ''} {origin.state} {origin.postalCode}</h3>
                                </div>
                                <div className='trips-show-address-display'>
                                    <h3 id='header'>Destination Address</h3>
                                    <h3>{destination.streetAddress}</h3>
                                    <h3>{destination.city}{(destination.city && destination.state) ? ',' : ''} {destination.state} {destination.postalCode}</h3>
                                </div>
                            </div>
                            <div className='trip-show-passengers'>
                                <h3 id='header'>Passengers</h3>
                                {trip.passengers.map( passenger => (
                                    <Passenger key={passenger.passenger._id} passenger={passenger}/>
                                ))}
                            </div>
                        </div>
                        <div className='trip-show-linear-map'>
                            {/* <img src={linearMap} alt="show-img" id='show-linear-map-img'/>1 */}
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