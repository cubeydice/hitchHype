import {useJsApiLoader, GoogleMap, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { useState, useRef } from 'react'
import './CreateTrip.css'
import { useDispatch, useSelector } from 'react-redux'
import * as tripActions from '../../store/trips'

const center = {lat: 37.7749, lng: -122.4194}    // where the map initially loads (San Francisco)
/* global google */

const CreateTrip = () => {
    //pull driver from state
    //pull car from state
    //send departureDate, origin, destination, availableSteats
    const sessionUser = useSelector(state => state.session.user)

    const [ googleMapsLibraries ] = useState(['places'])
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: googleMapsLibraries
    })
    const [availableSeats, setAvailableSeats] = useState()
    const [departureDate, setDeparturedate] = useState()
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [map, setMap] = useState( /** @type google.maps.Map */ (null))
    const originRef = useRef(null);
    const destinationRef = useRef(null);
    const dispatch = useDispatch()
    
    if(!isLoaded) {
        return <h1> Map is not loaded </h1>   // display an error message if the map is not loaded
    }


    const handleCreateTripSubmit = (e) => {
        e.preventDefault()
        const driver = sessionUser.id 
        //const car = sessionUser.car
        dispatch(tripActions.composeTrip({driver, departureDate, origin, destination, availableSeats}))
    }

    
    //handles the route calculation
    async function calculateRoute(e) {
        e.preventDefault()
        if (origin === '' || destination === '') {
            return
        }
        const direcitonsService = new google.maps.DirectionsService()
        const results = await direcitonsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        })
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
    }

    //clears the useState variables and input fields
    const clearRoute = (e) => {
        e.preventDefault()
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        setOrigin('')
        setDestination('')
    }
    
    //called specifically for the autofill functionality
    const handlePlaceChanged = (type) => {                  
        if (type === 'origin' && originRef.current) {
            const place = originRef.current.getPlace();
            if (place && place.name) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setOrigin(place.formatted_address);
                if(map) map.panTo({lat, lng})
            }
        }
        if (type === 'destination' && destinationRef.current) {
            const place = destinationRef.current.getPlace();
            if (place && place.name) {
                setDestination(place.formatted_address);
            }
        }
    };

    //called if the user does not use the autofill functionality
    const handleOrigin = (e) => {
        e.preventDefault()
        setOrigin(e.target.value)
    }

    const handleDestination = (e) => {
        e.preventDefault()
        setDestination(e.target.value)
    }


    return (
        <>
            <div className='create-trip'>
                <div className='routes-controller'>
                    <form className='routes-form' onSubmit={handleCreateTripSubmit} >
                        <h2 id='routes-form-title'>Let's Create a Trip!</h2>
                        <input 
                            type="date" 
                            id='departure-date' 
                            placeholder='Departure date'
                            value={departureDate}
                            onChange={(e) => setDeparturedate(e.target.value)}
                        />
                        <input 
                            type="number" 
                            id="available-seats" 
                            palceholder='Number of available seats'
                            value={availableSeats}
                            onChange={(e) => setAvailableSeats(e.target.value)}
                            min={1}
                            max={20}
                        />
                        <Autocomplete 
                            className='origin-autocomplete' 
                            onLoad={(autocomplete) => (originRef.current = autocomplete)}
                            onPlaceChanged={() => handlePlaceChanged('origin')}
                        >
                            <input 
                                id='origin'
                                placeholder='Origin' 
                                onBlur={handleOrigin}
                                type="text" 
                            />
                        </Autocomplete>
                        <Autocomplete 
                            className='destination-autocomplete' 
                            onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
                            onPlaceChanged={() => handlePlaceChanged('destination')}
                        >
                            <input 
                                id='destination'
                                placeholder='Destination'
                                onBlur={handleDestination} 
                                type="text" 
                            />
                        </Autocomplete>
                        <button id='calculate' onClick={calculateRoute}>Calculate Route</button>
                        <button id='clear' onClick={clearRoute}>Clear Route</button>
                    </form>
                    <div id='results'>
                        <div className='distance-container'>
                            <text id='distance-text'>Distance:</text>
                            <text id='distance-result'>{distance}</text>
                        </div>
                        <div className='duration-container'>
                            <text id='duration-text'>Duration:</text>
                            <text id='duration-result'>{duration}</text>
                        </div>
                    </div>
                </div>
                <GoogleMap  
                    center={center} 
                    zoom={13} 
                    mapContainerClassName='map'
                    options={{
                        streetViewControl: false
                    }}
                    onLoad={map => setMap(map)}
                >
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse}/>
                    )}
                </GoogleMap>
            </div>
        </>
    )
}

export default CreateTrip