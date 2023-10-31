import sfPic from "../../../assets/icons/sf-img.jpg"
import "./TripsItem.css"
import explodeAddress from "../AddressParser"
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

export function TripsItem ({ trip }) {
    const id = useParams();
    const showPage = '/trips/' + trip._id;
    const price = '$0'
    const proxyUrl = "https://corsproxy.io/?";
    const [image, setImage] = useState(sfPic);

    //GET ADDRESS
    let city;

    explodeAddress(trip.destination, function(err,addressStr)
    {
        city = addressStr.city;
    })

    // GET PLACE IMAGE
    const fetchPhotoRef = async () => {
        try{
        const placesRequestUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}/&key=${apiKey}`
        const response = await fetch(proxyUrl + encodeURIComponent(placesRequestUrl))
        const data = await response.json();

        if (data.results !== undefined) {
            if (data.results[0].photos !== undefined) {
                return data.results[0].photos[0].photo_reference} 
            else { return false }}
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
    }, [])

    return (
        <a href={ showPage } className="TripItem-container">
            <div className="TripItem-photo">
                {/* {trip.photo} */}
                <img src={image} alt="show-img" id='show-img'/>
                {/* photo */}
            </div>
            <div className="TripItem-details">
                <div className="TripItem-destination">
                    { city }
                </div>
                { id ? (
                    <></>
                ) : (
                    <div className="TripItem-price">
                    { price }
                    </div>
                ) }
            </div>
        </a>
    )
}

