import {useJsApiLoader, GoogleMap, DirectionsRenderer } from '@react-google-maps/api'
import { ReactComponent as Loading } from '../../assets/icons/loading-icon.svg'
import { useState } from 'react'
import { mapStyle } from '../../App'
import './RouteShow.css'

const center = {lat: 37.7749, lng: -122.4194}
const kmToMiles = (1000 * 0.621371)
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
    const passengers = trip.passengers
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
    const [directionsResponse, setDirectionsResponse] = useState(null)
     // eslint-disable-next-line

    if(!isLoaded) {
        return <div className='loading-page-container'><Loading/></div>   
    }

    async function calculateRoute() {
        let waypoints = []
        passengers.forEach((passenger) => {
            waypoints.push({location: passenger.dropoffPoint})
        })

        try {
            if (origin === '' || destination === '') {
                return
            }
            const directionsService = new google.maps.DirectionsService()
            const results = await directionsService.route({
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
                const distanceInMiles = (totalDistance / kmToMiles).toFixed(2);
                const hours = Math.floor(totalDuration / 3600);
                const minutes = Math.floor((totalDuration % 3600) / 60);
                setDistance(`${distanceInMiles} mi`);
                setDuration(`${hours} hours ${minutes} min `);
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
                    streetViewControl: false,
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
    )

}

export default RouteShow