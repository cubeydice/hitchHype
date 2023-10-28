import { useDispatch, useSelector } from "react-redux"
import sfPic from "../../../assets/icons/sf-img.jpg"
import linearMap from "../../../assets/images/linear-map-dummy.jpg"
import map from "../../../assets/images/map-api-dummy.jpg"
import profilePic from "../../../assets/images/profile-pic-dummy.jpg"
import "./RiderTripShow.css"
import { useState } from "react"
import { updateTrip } from "../../../store/trips"
import explodeAddress from "../AddressParser"
import { openModal } from "../../../store/modal"


export function RiderTripShow ({ trip }) {
    const dispatch = useDispatch();
    const date = new Date(trip.departureDate);
    const sessionUser = useSelector(state => state.session.user);
    let rider = false;
    const availableSeats = (trip.passengers ? (trip.availableSeats - trip.passengers.length) : (null));
    let destinationCity;
    let originCity;
    // console.log("trip:", trip)

    const handleClick = () => {
        if(rider){
            // dispatch(updateTrip({passengers}))
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
            if(sessionUser && sessionUser._id === payload.passenger._is){
                rider = true;
            }
            // console.log(payload)
            passengerArr.push(
                //will update with users profile once those are up
                <a href="">
                    <button key={payload.passenger._id} id="passengers-list-btns">{payload.passenger.firstName}</button>
                </a>
            )
        }
        return passengerArr;
    }


    return (
        <> 
            { trip.origin ? (
                <>
                    <div className="rider-show-destination-details-container">
                        <div className="Rider-show-destination-pic">
                            <img src={sfPic} alt="show-img" id='show-img'/>
                        </div>
                        <div className="rider-show-destintion-info">
                            <div className='trip-show-points-container'>
                                <div className='trip-show-endPoint'>
                                    <h3 id='trip-show-points'>{originCity}</h3>
                                </div>
                                <div>
                                    <h3 id='trip-show-points'>→</h3>
                                </div>
                                <div className='trip-show-StartPoint'>
                                    <h3 id='trip-show-points'>{destinationCity}</h3>
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
                                    <h3>The trip will take place on {date.toDateString()}.</h3>
                                </div>
                                <div className="trip-show-min-distance">
                                    <h3>Min. distance: 100mi</h3>
                                </div>
                                <div className="trip-show-min-price">
                                    <h3>Max. price for additional rider: $45</h3>
                                </div>
                                <div className="rider-show-btn">
                                    { sessionUser ? (
                                        <> { rider ? (
                                            <button onClick={ handleClick }>Leave Trip</button>
                                        ) : (
                                            <button onClick={ handleClick }>Request Ride</button>
                                        )} 
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rider-show-driver-maps-container">
                        <div className="rider-show-driver-details">
                            <div className="rider-show-driver-pic">
                                <img src={profilePic} alt="show-img" id='driver-img'/>
                            </div>
                            <div className="rider-show-driver-passenger-container">
                                <div className="rider-show-driver-info">
                                    <h3>Driver: {trip.driver.firstName}</h3>
                                    <div className="rider-show-driver-ratings">
                                        <h3>driver review ratings</h3>
                                    </div>
                                    <h3>Driver Bio</h3>
                                </div>
                                <div className="rider-show-passenger-info">
                                    <h3>PASSENGERS</h3>
                                    <div className="rider-show-passengers-list">
                                        {passengerFn()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rider-show-linear-map">
                            <img src={linearMap} alt="show-img" id='show-linear-map-img'/>
                        </div>
                        <div className="rider-show-maps-api">
                        <img src={map} alt="show-img" id='show-linear-map-img'/>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </>
    )
}