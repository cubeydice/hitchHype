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
    const [image, setImage] = useState();
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

    useEffect(() => {
        if(trip.photoUrl) {
            setImage(trip.photoUrl)
        } else {
            setImage(sfPic)
        }
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

