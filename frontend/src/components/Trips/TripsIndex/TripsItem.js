

import { useState } from "react"
import sfPic from "../../../assets/icons/sf-img.jpg"
import "./TripsItem.css"
import explodeAddress from "../AddressParser"

export function TripsItem ({ trip }) {
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
                <div className="TripItem-price">
                    { price }
                </div>
            </div>
        </a>
    )
}

