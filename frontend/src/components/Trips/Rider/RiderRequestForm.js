import {useJsApiLoader, GoogleMap, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { useDispatch, useSelector } from "react-redux"
import { closeModal } from "../../../store/modal"
import { useState, useRef } from "react";
import './RiderRequestForm.css'
import { updateTrip } from '../../../store/trips';

const center = {lat: 37.7749, lng: -122.4194}
/* global google */

export function RiderRequestForm(){
    const [ googleMapsLibraries ] = useState(['places'])
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: googleMapsLibraries
    })
    const trip = useSelector(state => state.trips)
    const sessionUser = useSelector(state => state.session.user)
    const origin = trip.origin
    const destination = trip.destination
    const [waypoints, setWaypoints] = useState([])
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [map, setMap] = useState( /** @type google.maps.Map */ (null))
    const waypointRef = useRef(null)
    const dispatch = useDispatch();
    console.log(trip)

    if(!isLoaded) {
        return <h1> Map is not loaded </h1>   // display an error message if the map is not loaded
    }

    async function calculateRoute() {
        try {
            if (origin === '' || destination === '') {
                return
            }
            const direcitonsService = new google.maps.DirectionsService()
            const results = await direcitonsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: waypoints,
                optimizeWaypoints: true
            })
            if (results) {
                setDirectionsResponse(results)
                
                let totalDistance = 0
                let totalDuration = 0
                results.routes[0].legs.forEach(leg => {
                    totalDistance += leg.distance.value; 
                    totalDuration += leg.duration.value; 
                });
                const distanceInMiles = (totalDistance / 1000 * 0.621371).toFixed(2);
                const hours = Math.floor(totalDuration / 3600);
                const minutes = Math.floor((totalDuration % 3600) / 60);

               setDistance(`${distanceInMiles} miles`);
                setDuration(`${hours}h ${minutes}m`);
            }
        } catch (error) {
            console.error(error)
            console.log('invalid origin and destinaiton. Please ensure your route can be driven from start to finish')
        }
    }

    const handlePlaceChanged = () => {
        const place = waypoints.current.getPlace();
        if (place && place.formatted_address) {
            setWaypoints(initialWaypoints => [...initialWaypoints, {location: place.formatted_address}])
        }
    }

    const handleSubmit = () => {
        closeModal()
        // const driver = trip.driver._id
        // const car = trip.car._id
        // const departureDate = trip.departureDate
        // const availableSeats = trip.availableSeats
        // const tripId = trip._id
        const passengerId = sessionUser._id
        const previousPassengers = trip.passengers
        const passengers = [...previousPassengers, {passenger: passengerId, dropoffPoint: waypoints[0].location }]
        const newTrip = {...trip, passengers}
            dispatch(updateTrip(newTrip))
            .then((res) => {
                if(res && res.errors) {
                    console.error(res.errors)
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }
    
    const handleShowNewRoute = () => {
        console.log(waypoints)
        calculateRoute()
    }

    const handleWaypoint = (e) => {
        e.preventDefault()
        setWaypoints(initialWaypoints => [...initialWaypoints, {location: e.target.value}])
    }

    return(
        <div className='rider-request'>
            <div className="rider-request-form-header">
                <h3>Request a Ride</h3>
            </div>
            <div className="rider-request-form-div">
                <h3>Drop off address</h3>
                <form className="rider-request-form" >
                    <Autocomplete
                        className='waypoint-autocomplete'
                        onLoad={(autocomplete) => (waypointRef.current = autocomplete)}
                        onPlaceChanged={() => handlePlaceChanged}
                    >
                        <input 
                            id="waypoint" 
                            placeholder="Drop off address"
                            onBlur={handleWaypoint}
                            type="text"
                        />
                    </Autocomplete>
                </form>
            </div>
            <div className="google-map">
                <div className='distance-container'>
                    <p id='distance-text'>Distance:</p>
                    <p id='distance-result'>{distance}</p>
                </div>
                <div className='duration-container'>
                    <p id='duration-text'>Duration:</p>
                    <p id='duration-result'>{duration}</p>
                </div>
                <GoogleMap  
                    center={center} 
                    zoom={13} 
                    mapContainerClassName='map'
                    id='map'
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        zoomControl: false
                    }}
                    onLoad={() => {
                        calculateRoute()
                    }}
                >
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse}/>
                    )}
                </GoogleMap>
            </div>
            <div className="rider-request-form-btn-container">
                <button onClick={() => handleShowNewRoute()}>Show New Route</button>
            </div>
            <div className="rider-request-form-btn-container">
                <button onClick={handleSubmit}>Request Ride</button>
            </div>
        </div>
    )
}