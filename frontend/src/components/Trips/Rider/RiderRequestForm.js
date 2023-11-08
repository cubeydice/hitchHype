import {useJsApiLoader, GoogleMap, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { ReactComponent as Loading } from '../../../assets/icons/loading-icon.svg'
import { useDispatch, useSelector } from "react-redux"
import { closeModal } from "../../../store/modal"
import { useState, useRef, useEffect } from "react";
import './RiderRequestForm.css'
import { updateTrip } from '../../../store/trips';
import { useHistory } from 'react-router-dom';
import { mapStyle } from '../../../App';


const center = {lat: 37.7749, lng: -122.4194}
const kmToMiles = (1000 * 0.621371)
/* global google */

export function RiderRequestForm(){
    const [ googleMapsLibraries ] = useState(['places'])
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: googleMapsLibraries
    })
    const trip = useSelector(state => state.trips)
    const passengers = trip.passengers
    const sessionUser = useSelector(state => state.session.user)
    const origin = trip.origin
    const destination = trip.destination
    const [errors, setErrors] = useState('')
    const [waypoints, setWaypoints] = useState([])
    const [newWaypoint, setNewWaypoint] = useState(null);
    const [lastCalculatedWaypoint, setLastCalculatedWaypoint] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const waypointRef = useRef(null)
    const dispatch = useDispatch();
    const history = useHistory()

    useEffect(() => {
        const preExistingWaypoints = passengers.map(passenger => ({ location: passenger.dropoffPoint }));
        setWaypoints(preExistingWaypoints);
    }, [passengers]);
    
    if(!isLoaded) {
        return <div className='loading-page-container'><Loading/></div>   
    }

    async function calculateRoute() {
        let allWaypoints = [...waypoints];

        // Remove the previously calculated waypoint if it exists
        if (lastCalculatedWaypoint) {
            allWaypoints = allWaypoints.filter(wp => wp.location !== lastCalculatedWaypoint.location);
        }

        // Store the new waypoint as the last calculated one
        if (newWaypoint) {
            allWaypoints.push(newWaypoint);
            setLastCalculatedWaypoint(newWaypoint);  
        }

        try {
            if (origin === '' || destination === '') {
                return
            }
            const direcitonsService = new google.maps.DirectionsService()
            const results = await direcitonsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: allWaypoints,
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
                const distanceInMiles = Math.floor(totalDistance / kmToMiles);
                const hours = Math.floor(totalDuration / 3600);
                const minutes = Math.floor((totalDuration % 3600) / 60);
                setDistance(distanceInMiles);
                setDuration(`${hours} hours ${minutes} min`);
            }
        } catch (error) {
            console.error(error)
            setErrors('Invalid drop off point. Please ensure your route can be driven from start to finish')
        }
    }

    const handlePlaceChanged = () => {
        const place = waypointRef.current.getPlace();
        if (place && place.formatted_address) {
            setNewWaypoint({ location: place.formatted_address });
        }
    }

    const handleSubmit = () => {
        const passengerId = sessionUser._id
        const previousPassengers = trip.passengers
        const passengers = [...previousPassengers, {passenger: passengerId, dropoffPoint: newWaypoint.location }]
        const newTrip = {...trip, passengers, distance}
        dispatch(updateTrip(newTrip))
        .then((res) => {
            closeModal()
            history.go()
        })
        .catch((error) => {
            console.error(error)
        })
    }
    
    const handleShowNewRoute = () => {
        calculateRoute()
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
                        onPlaceChanged={handlePlaceChanged}
                    >
                        <input 
                            id="waypoint" 
                            placeholder="Drop off address"
                            type="text"
                        />
                    </Autocomplete>
                </form>
            </div>
            <div className="google-map">
                <div className='distance-container'>
                    <p id='distance-text'>Distance:</p>
                    <p id='distance-result'>{distance} mi</p>
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
                        zoomControl: false,
                        styles: mapStyle
                    }}
                    onLoad={() => {
                        calculateRoute()
                    }}
                >
                    {directionsResponse && (
                        <DirectionsRenderer 
                        directions={directionsResponse}
                        options={{
                            polylineOptions: {
                                strokeOpacity: .8,
                                strokeColor: '#60992D',
                                strokeWeight: 6
                            },
                        }}
                        />
                    )}
                </GoogleMap>
            </div>
            <div className="rider-request-form-btn-container">
                <button className='rider-request-buttons' onClick={() => handleShowNewRoute()}>Show New Route</button>
                <button className='rider-request-buttons' onClick={handleSubmit}>Request Ride</button>
                <span className='errors' >{errors}</span>
            </div>
        </div>
    )
}