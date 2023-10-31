import { useDispatch, useSelector } from "react-redux"
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { openModal } from "../../../store/modal"
import RouteShow from "../../RouteShow/RouteShow"
import sfPic from "../../../assets/icons/sf-img.jpg"
import defaultProfilePic from '../../../assets/icons/user.png'
import explodeAddress from "../AddressParser"
import "./RiderTripShow.css"
import CarbonEmissions from "../../CarbonEmissions";
import { useState } from "react";
import { updateTrip } from "../../../store/trips";

export function RiderTripShow ({ trip }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    const date = new Date(trip.departureDate);
    const todaysDate =  new Date();
    let rider = false;
    let riderId;
    // const [rider, setRider] = useState(false)
    const availableSeats = (trip.passengers ? (trip.availableSeats - trip.passengers.length) : (null));
    let destinationCity;
    let originCity;
    let passengersArr;
    const [tripOver, setTripOver] = useState(false)

    if(date.getFullYear() < todaysDate.toDateString()){
        setTripOver(true);
    }else if(date.getFullYear() === todaysDate.toDateString()){
        if(todaysDate.getMonth() > date.getMonth()){
            setTripOver(true);
        }else if(todaysDate.getDate() > date.getDate()){
            setTripOver(true);
        }
    }

    const handleClick = () => {
        if(rider){
            // console.log(riderId)
            passengersArr = trip.passengers.filter((payload) => (payload._id !== riderId));
            dispatch(updateTrip({...trip, passengers: passengersArr})).then( history.push(`/trips/${trip._id}`)).then(history.go())
        }else{
            dispatch(openModal('request-ride-form'))
        }
    }
    explodeAddress(trip.destination, function(err,addressStr)
    {
        destinationCity = addressStr.city;
    })
    explodeAddress(trip.origin, function(err,addressStr)
    {
        originCity = addressStr.city;
    })

    //can only request if logged in.
    const passengerFn = () => {
        const passengerArr = [];
        for(let payload of trip.passengers)
        {
            if(sessionUser && sessionUser._id === payload.passenger._id){
                rider = true;
                // setRider(true)
            }

            passengerArr.push(
                <Link to={`/profile/${payload.passenger._id}`}>
                    <button key={payload.passenger._id} id="passengers-list-btns">{payload.passenger.firstName}</button>
                </Link>
            )
        }
        return passengerArr;
    }

    const checkUserPassenger = () => {

        if(trip){
            for(let payload of trip.passengers)
            {
                if(sessionUser && sessionUser._id === payload.passenger._id){
                    rider = true;
                    riderId = payload._id;
                    // setRider(true)
                }
            }
        }
        return rider
    }


    return (
        <>
            { trip.origin ? (
                <div className="rider-show-layout">
                    <div className="rider-show-destination-details-container">
                        <div className="Rider-show-destination-pic">
                            <img src={sfPic} alt="rider-show-img" id='rider-show-img'/>
                        </div>
                        <div className="rider-show-destintion-info">
                            <div className='trip-show-points-container'>
                                <div className='trip-show-startPoint'>
                                    <h3 id='trip-show-points'>{originCity}</h3>
                                </div>
                                <div>
                                    <h3 id='trip-show-points'>→</h3>
                                </div>
                                <div className='trip-show-endPoint'>
                                    <h3 id='trip-show-points'>{destinationCity}</h3>
                                </div>
                            </div>
                            <div>
                                <div className='trip-show-passangers-ammount'>
                                    <h3 id="trip-passenger-show-details">Current amount of passengers: {trip.passengers.length}</h3>
                                </div>
                                <div className='trip-show-spots'>
                                    <h3 id="trip-passenger-show-details">The amount of seats left: {availableSeats}</h3>
                                </div>
                                <div className='trip-show-departure-time'>
                                    <h3 id="trip-passenger-show-details">The trip will take place on {date.toDateString()}.</h3>
                                </div>
                                <div className="trip-show-min-price">
                                    <h3 id="trip-passenger-show-details">Max. price for additional rider: $45</h3>
                                </div>
                                <div className="rider-show-btn">
                                    { tripOver ? (
                                        <button id="request-rides-btn" disabled>Trip Over</button>
                                    ) : (
                                        <>
                                            { sessionUser  ? (
                                                <> { checkUserPassenger() ? (
                                                    <button id="request-rides-btn" onClick={ handleClick }>Leave Trip</button>
                                                ) : (
                                                    <> { trip.availableSeats - trip.passengers.length > 0 ? (
                                                        <button id="request-rides-btn" onClick={ handleClick }>Request Ride</button>
                                                    ) : (
                                                        <button id="request-rides-btn">No Rides Available</button>
                                                    )}
                                                    </>
                                                )}
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rider-show-driver-maps-container">
                        <div className="rider-show-driver-details">
                            <div className="rider-show-driver-pic">
                                <img src={trip.driver.profilePicture ? trip.driver.profilePicture : defaultProfilePic} alt="show-img" className="large-icon" id='driver-img'/>
                            </div>
                            <div className="rider-show-driver-passenger-container">
                                <div className="rider-show-driver-info">
                                    <h2 id="trip-passenger-show-details">Driver: {trip.driver.firstName}</h2>
                                    <div className="rider-show-driver-ratings">
                                        {trip.driver.avgRating ? (
                                            <h3 id="trip-passenger-show-details">Avg Rating: {Math.round(trip.driver.avgRating * 10) / 10}</h3>
                                        ) : (<></>) }
                                    </div>
                                    {
                                        trip.driver.biography ? (
                                            <>
                                                <h3 id="trip-passenger-show-details">Driver Bio</h3>
                                                <p>{trip.driver.biography}</p>
                                            </>
                                        ) : (<></>)
                                    }
                                    
                                </div>
                                <div className="rider-show-passenger-info">
                                    <h2>PASSENGERS</h2>
                                    <div className="rider-show-passengers-list">
                                        {passengerFn()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rider-show-linear-map">
                            <CarbonEmissions trip={trip}/>
                        </div>
                        <div className="rider-show-maps-api">
                            <RouteShow trip={trip} driver={false} />
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    )
}