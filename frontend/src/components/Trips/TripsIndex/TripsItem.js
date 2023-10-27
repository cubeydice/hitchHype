

import { useState } from "react"
import sfPic from "../../../assets/icons/sf-img.jpg"
import "./TripsItem.css"
import explodeAddress from "../AddressParser"
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

export function TripsItem ({ trip }) {
    const id = useParams();
    let city
 
    explodeAddress(trip.destination, function(err,addressStr)
    {
        city = addressStr.city;
    })
    const showPage = '/trips/' + trip._id;

    const price = '$0'

    return (
        <a href={ showPage } className="TripItem-container">
            <div className="TripItem-photo">
                {/* {trip.photo} */}
                <img src={sfPic} alt="show-img" id='show-img'/>
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

