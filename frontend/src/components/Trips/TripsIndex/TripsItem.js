import { useEffect, useState } from "react";
import explodeAddress from "../AddressParser"
import { placeholderGasPrice } from "../../GasPrices/GasPrices";
import sfPic from "../../../assets/icons/sf-img.jpg"
import "./TripsItem.css"

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

export function TripsItem ({ trip }) {
    const showPage = '/trips/' + trip._id;
    const price = trip.car ? Math.round(trip.car.mpg * placeholderGasPrice /
                            (trip.availableSeats ? (trip.passengers.length + 2)
                            : 0)) : 0
    const date = new Date(trip.departureDate);
    const [image, setImage] = useState(sfPic);
    const proxyUrl = "https://corsproxy.io/?";

    //GET ADDRESS
    let destinationCity;
    let originCity;

    explodeAddress(trip.destination, function(err,addressStr)
    {
        destinationCity = addressStr.city;
    })

    explodeAddress(trip.origin, function(err,addressStr)
    {
        originCity = addressStr.city;
    })

    // GET PLACE IMAGE
    const fetchPhotoRef = async () => {
        try{
        const placesRequestUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${destinationCity}/&key=${apiKey}`
        // const response = await fetch(proxyUrl + encodeURIComponent(placesRequestUrl)) //with proxy for dev
        const response = await fetch(placesRequestUrl)
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
        // const response = await fetch(proxyUrl + encodeURIComponent(photoRequestUrl))
        const response = await fetch(photoRequestUrl)
        return setImage(response.url)
    }

    useEffect(()=>{
        fetchPhotoRef().then(res => {if (res) fetchPhoto(res)})
    // eslint-disable-next-line
    }, [])

    return (
        <a href={ showPage } className="TripItem-container">
            <div className="TripItem-photo">
                <img src={image} alt="show-img" id='show-img'/>
            </div>
            <div className="TripItem-details">
                <div className="TripItem-destination">
                    { originCity + "→" + destinationCity }
                </div>
                <div>{date.toLocaleDateString('en-US')}</div>
                {
                    <div className="TripItem-price">
                    {price ? `$${price}` : "No seats left"}
                    </div>
                }
            </div>
        </a>
    )
}

