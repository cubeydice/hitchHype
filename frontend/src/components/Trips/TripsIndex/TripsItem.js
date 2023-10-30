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
    // const [image, setImage] = useState(sfPic);

    //GET ADDRESS
    let city;

    explodeAddress(trip.destination, function(err,addressStr)
    {
        city = addressStr.city;
    })

    //GET PLACE IMAGE
    // const fetchImage = async () => {
    //     try{
    //     const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}/&key=${apiKey}`)
    //     const data = await response.json();

    //     console.log(data)
    //   } catch (error) {
    //     console.log("failed")
    //   }
    // }

    // useEffect(()=>{
    //     fetchImage()
    // }, [])

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

