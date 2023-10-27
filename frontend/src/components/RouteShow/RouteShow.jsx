import {useJsApiLoader, GoogleMap, DirectionsRenderer } from '@react-google-maps/api'
import { useParams } from 'react-router-dom'

const RouteShow = () => {
    const {tripId} = useParams()
    const [ googleMapsLibraries ] = useState(['places'])
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: googleMapsLibraries
    })

    if(!isLoaded) {
        return <h1> Map is not loaded </h1>   // display an error message if the map is not loaded
    }

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

    return (
        <>
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
                options={{
                    streetViewControl: false
                }}
                onLoad={map => setMap(map)}
            >
                {directionsResponse && (
                    <DirectionsRenderer directions={directionsResponse}/>
                )}
            </GoogleMap>
        </>
    )

}

export default RouteShow