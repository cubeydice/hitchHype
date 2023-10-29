import { Link } from "react-router-dom/cjs/react-router-dom.min";
import defaultProfilePic from '../../../assets/icons/user.png'
import explodeAddress from "../AddressParser"
import "./Passenger.css"

export function Passenger({ passenger: { dropoffPoint, passenger }}){
    let dropOff= {
        city: "",
        state: "",
        country: "",
        postalCode: "",
        streetAddress: ""
    };
    explodeAddress(dropoffPoint, function(err,addressStr)
    {
        dropOff["city"] = addressStr.city;
        dropOff["state"] = addressStr.state;
        dropOff["country"] = addressStr.country;
        dropOff["postalCode"] = addressStr.postal_code;
        dropOff["streetAddress"] = addressStr.street_address1;
    })

    return (
        <div className="passenger-container">
            <Link to={`/profile/${passenger._id}`}>
                <div className="passenger-profile-pic">
                    <img src={passenger.profilePicture ? passenger.profilePicture : defaultProfilePic } alt="show-img" className='large-icon'/>
                </div>
                <div className="passenger-name">
                    <h3>{passenger.firstName} {passenger.lastName}</h3>
                </div>
            </Link>
            <div className="passenger-dropoff">
                <h3>{dropOff["streetAddress"]}</h3>
                <h3>{dropOff["city"]}, {dropOff["state"]} {dropOff["postalCode"]}</h3>
            </div>
        </div>
    )
}