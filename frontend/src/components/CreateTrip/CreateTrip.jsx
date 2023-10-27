import {useJsApiLoader, GoogleMap, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { useState, useRef } from 'react'
import './CreateTrip.css'
import { useDispatch, useSelector } from 'react-redux'
import {composeTrip, clearTripErrors} from '../../store/trips'
import { useHistory } from 'react-router-dom'
import { openModal } from '../../store/modal'


const center = {lat: 37.7749, lng: -122.4194}    // where the map initially loads (San Francisco)
/* global google */

const CreateTrip = () => {
    const [ googleMapsLibraries ] = useState(['places'])
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: googleMapsLibraries
    })
    const sessionUser = useSelector(state => state.session.user)
    const errors = useSelector(state => state.errors.trips)
    const maxPassengers = useSelector(state => state.session.user.maxPassengers)
    const [availableSeats, setAvailableSeats] = useState('')
    const [departureDate, setDepartureDate] = useState('')
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [map, setMap] = useState( /** @type google.maps.Map */ (null))
    const originRef = useRef(null);
    const destinationRef = useRef(null);
    const dispatch = useDispatch()
    const history = useHistory()

    if(!isLoaded) {
        return <h1> Map is not loaded </h1>   // display an error message if the map is not loaded
    }

    //handles creating a trip when the form is submitted
    const handleCreateTripSubmit = (e) => {
        e.preventDefault()
        const driver = sessionUser._id 
        const car = sessionUser.car
        const passengers = []
            dispatch(composeTrip({driver, car, passengers, departureDate, origin, destination, availableSeats}))
            .then((res) => {
                if (res && !res.errors) {
                    dispatch(clearTripErrors())   
                    history.push(`/trips/${res._id}`)
                } else if (res && res.errors) {
                    console.error(res.errors)
                    if(res.errors.car && !res.errors.origin && !res.errors.destination && !res.errors.availableSeats && !res.errors.departureDate) {
                        dispatch(openModal('error'))
                    }
                }
            })
            .catch((error) => {
                console.error(error)
            })

    }

    //handles the route calculation
    async function calculateRoute(e) {
        e.preventDefault()
        try {
            if (origin === '' || destination === '') {
                return
            }
            const direcitonsService = new google.maps.DirectionsService()
            const results = await direcitonsService.route({
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            })
            if (results) {
                       setDirectionsResponse(results)
                setDistance(results.routes[0].legs[0].distance.text)
                setDuration(results.routes[0].legs[0].duration.text)
            }
        } catch (error) {
            console.error(error)
            console.log('invalid origin and destinaiton. Please ensure your route can be driven from start to finish')
        }
    }

    //clears the useState variables and input fields
    const clearRoute = (e) => {
        e.preventDefault()
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        setOrigin('')
        setDestination('')
        setAvailableSeats('')
        setDepartureDate('')
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
                        <h3 className='headers'>Departure Date</h3>
                        <span className='errors' >{errors?.departureDate}</span>
                        <input 
                            type="date" 
                            id='departure-date' 
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            placeholder='Departure date'
                        />
                        <h3 className='headers' >Available Seats</h3>
                        <span className='errors' >{errors?.availableSeats}</span>
                        <input 
                            type="number" 
                            id="available-seats" 
                            value={availableSeats}
                            onChange={(e) => setAvailableSeats(e.target.value)}
                            min={1}
                            max={maxPassengers ? maxPassengers : 1}
                            palceholder='Number of available seats'
                        />
                        <h3 className='headers' >Origin</h3>
                        <span className='errors' >{errors?.origin}</span>
                        <Autocomplete 
                            className='origin-autocomplete' 
                            onLoad={(autocomplete) => (originRef.current = autocomplete)}
                            onPlaceChanged={() => handlePlaceChanged('origin')}
                        >
                            <input 
                                id='origin'
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                placeholder='Origin' 
                                onBlur={handleOrigin}
                                type="text" 
                            />
                        </Autocomplete>
                        <h3 className='headers' >Destination</h3>
                        <span className='errors' >{errors?.destination}</span>
                        <Autocomplete 
                            className='destination-autocomplete' 
                            onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
                            onPlaceChanged={() => handlePlaceChanged('destination')}
                        >
                            <input 
                                id='destination'
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder='Destination'
                                onBlur={handleDestination} 
                                type="text" 
                            />
                        </Autocomplete>
                        <button id='calculate' onClick={calculateRoute}>Calculate Route</button>
                        <button id='clear' onClick={clearRoute}>Clear Trip</button>
                        <button id='submit' type='submit'>Create Your Trip</button>
                    </form>
                    <div id='results'>
                        <div className='distance-container'>
                            <p id='distance-text'>Distance:</p>
                            <p id='distance-result'>{distance}</p>
                        </div>
                        <div className='duration-container'>
                            <p id='duration-text'>Duration:</p>
                            <p id='duration-result'>{duration}</p>
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