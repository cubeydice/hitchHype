import {useJsApiLoader, GoogleMap, DirectionsRenderer } from '@react-google-maps/api'
import { useState } from 'react'
import './RouteShow.css'

const center = {lat: 37.7749, lng: -122.4194}
/* global google */

const RouteShow = ({trip}) => {
    const [ googleMapsLibraries ] = useState(['places'])
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: googleMapsLibraries
    })
    const origin = trip.origin
    const destination = trip.destination
     // eslint-disable-next-line
    const waypoints = trip.waypoints
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [directionsResponse, setDirectionsResponse] = useState(null)
     // eslint-disable-next-line
    const [map, setMap] = useState( /** @type google.maps.Map */ (null))


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
                travelMode: google.maps.TravelMode.DRIVING
                //add waypoints
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

    return (
        <div className='route-show-container'>
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
                zoom={14}
                mapContainerClassName='map'
                id='map'
                options={{
                    streetViewControl: false
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
    )

}

export default RouteShow