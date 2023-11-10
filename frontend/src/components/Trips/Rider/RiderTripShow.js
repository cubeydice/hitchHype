import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link, useHistory } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import "./RiderTripShow.css";

//STORE
import { updateTrip } from "../../../store/trips";
import { openModal } from "../../../store/modal"

//COMPONENTS
import RouteShow from "../../RouteShow/RouteShow"
import explodeAddress from "../AddressParser"
import CarbonEmissions from "../../CarbonEmissions";
import { placeholderGasPrice } from "../../GasPrices/GasPrices";

//ASSETS
import { ReactComponent as PassengerIcon } from "../../../assets/icons/Trips/person.svg"
import { ReactComponent as SeatIcon } from "../../../assets/icons/Trips/seat.svg"
import sfPic from "../../../assets/icons/sf-img.jpg"
import defaultProfilePic from '../../../assets/icons/user.png'

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

export function RiderTripShow ({ trip }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    const [tripOver, setTripOver] = useState(false)
    const [image, setImage] = useState(sfPic);

    const date = new Date(trip.departureDate);
    var pstDate = date.toUTCString().split(" ")
    pstDate = pstDate.slice(0,4).join(" ")
    // var pstDate = trip.departureDate.toLocaleString("en-US", {
    //     timeZone: "America/Los_Angeles"
    //   })
    //   console.log(date.toUTCString())
    const todaysDate =  new Date();

    let rider = false;
    let riderId;

    const availableSeats = (trip.passengers ? (trip.availableSeats - trip.passengers.length) : (null));
    const price = trip.car ? Math.round(trip.car.mpg * placeholderGasPrice /
    (trip.availableSeats ? (trip.passengers.length + 1)
    : 0)) : 0
    const hitchPrice = trip.car ? Math.round(trip.car.mpg * placeholderGasPrice /
    (trip.availableSeats ? (trip.passengers.length + 2)
    : 0)) : 0
    let destinationCity;
    let originCity;
    let passengersArr;
    const proxyUrl = "https://corsproxy.io/?";

    const handleClick = () => {
        if(rider){
            passengersArr = trip.passengers.filter((payload) => (payload._id !== riderId));
            dispatch(updateTrip({...trip, passengers: passengersArr})).then( history.push(`/trips/${trip._id}`)).then(history.go())
        }else{
            dispatch(openModal('request-ride-form'))
        }
    }

    //DATE
    if(date.getFullYear() < todaysDate.toDateString()){
        setTripOver(true);
    }else if(date.getFullYear() === todaysDate.toDateString()){
        if(todaysDate.getMonth() > date.getMonth()){
            setTripOver(true);
        }else if(todaysDate.getDate() > date.getDate()){
            setTripOver(true);
        }
    }

    const handleUpdateDropoffClick = () => {
        dispatch(openModal('request-ride-form'))
    }
    
    //ADDRESS
    explodeAddress(trip.destination, function(err,addressStr)
    {
        destinationCity = addressStr.city;
    })
    explodeAddress(trip.origin, function(err,addressStr)
    {
        originCity = addressStr.city;
    })

    //PASSENGERS
    //can only see if logged in
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
                }
            }
        }
        return rider
    }

    // GET PLACE IMAGE
    const fetchPhotoRef = async () => {
        try{
        const placesRequestUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${destinationCity}/&key=${apiKey}`
        const response = await fetch(proxyUrl + encodeURIComponent(placesRequestUrl))
        const data = await response.json();

        if (data.results !== undefined) {
            if (data.results[0].photos !== undefined) {
                return data.results[0].photos[0].photo_reference}}
        else return false
      } catch (error) {
        return false
      }
    }

    const fetchPhoto = async (photoRef) => {
        const photoRequestUrl = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoRef}&key=${apiKey}&maxwidth=700&maxheight=700`
        const response = await fetch(proxyUrl + encodeURIComponent(photoRequestUrl))
        return setImage(response.url)
    }

    useEffect(()=>{
        fetchPhotoRef().then(res => {if (res) fetchPhoto(res)})
        // eslint-disable-next-line
    }, [destinationCity])


    return (
        <>
            { trip.origin ? (
                <div className="rider-show-layout">
                    <div className="rider-show-destination-details-container">
                        <div className="Rider-show-destination-pic">
                            <img src={image} alt="rider-show-img" id='rider-show-img'/>
                        </div>
                        <div className="rider-show-destination-info">
                            <div className='trip-show-points-container'>
                                <div className='trip-show-startPoint'>
                                    <h1 id='trip-show-points'>{originCity}</h1>
                                </div>
                                <div>
                                    <h3 id='trip-show-points'>→</h3>
                                </div>
                                <div className='trip-show-endPoint'>
                                    <h1 id='trip-show-points'>{destinationCity}</h1>
                                </div>
                            </div>
                            <div className="ride-show-details-container">
                                <div className="ride-show-details">
                                    <h3>Date of trip: <span className="light">{pstDate}</span></h3>
                                </div>
                                <div className="ride-show-details">
                                    <h3># of passengers:</h3>
                                    <div>{Array(trip.passengers.length).fill(true).map((_, i) => <PassengerIcon key={i} className="medium-icon"/>)}</div>
                                </div>
                                <div className="ride-show-details">
                                    <h3>Seats left:</h3>
                                    <div>{Array(availableSeats).fill(true).map((_, i) => <SeatIcon key={i} className="medium-icon"/>)}</div>
                                </div>
                                <div className="ride-show-details">
                                    <h3 id="trip-passenger-show-details">Est. cost for current passengers: <span className="light">{`$${price}`}</span></h3>
                                </div>
                                <div className="ride-show-details">
                                    <h3 id="trip-passenger-show-details">Est. cost if another hitchHyper joins: <span className="light">{`$${hitchPrice}`}</span></h3>
                                </div>
                                <div className="rider-show-btn">
                                    { tripOver ? (
                                        <button id="request-rides-btn" disabled>Trip Over</button>
                                    ) : (
                                        <>
                                            { sessionUser  ? (
                                                <> { checkUserPassenger() ? (
                                                    <>
                                                        <button id="request-rides-btn" onClick={ handleClick }>Leave Trip</button>
                                                        <button id="request-rides-btn" onClick={ handleUpdateDropoffClick }>Update Dropoff Point</button>
                                                    </>
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
                                <Link to={`/profile/${trip.driver._id}`}>
                                    <img src={trip.driver.profilePicture ? trip.driver.profilePicture : defaultProfilePic} alt="show-img" className="large-icon" id='driver-img'/>
                                </Link>
                            </div>

                            <div className="rider-show-driver-passenger-container">
                                <div className="rider-show-driver-info">

                                        <Link to={`/profile/${trip.driver._id}`}>
                                            <h2>🚙 {trip.driver.firstName}</h2>
                                        </Link>
                                        <div className="rider-show-driver-ratings">
                                            <StarRatings
                                                rating={trip.driver.avgRating}
                                                starRatedColor="#e8ae42"
                                                starDimension="20px"
                                                starSpacing="1px"
                                                className='rating'
                                            />
                                        </div>
                                    {
                                        trip.driver.biography ? (
                                            <>
                                                <p>{trip.driver.biography}</p>
                                            </>
                                        ) : (<></>)
                                    }
                                </div>

                                <div className="rider-show-passenger-info">
                                    <h2>Passengers</h2>
                                    <div className="rider-show-passengers-list">
                                        {passengerFn()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rider-show-ce">
                            <CarbonEmissions trip={trip}/>
                        </div>
                        <div className="rider-show-maps-api">
                            <RouteShow trip={trip} driver={false} />
                        </div>
                    </div>

                    <div className="rider-show-reviews-container"></div>
                </div>
            ) : (
                <></>
            )}
        </>
    )
}