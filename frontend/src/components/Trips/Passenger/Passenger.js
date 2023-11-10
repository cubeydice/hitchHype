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
            <div className="passenger-link">
                <Link to={`/profile/${passenger._id}`}>
                    <div className="profile-link">
                        <div className="passenger-profile-pic">
                            <img src={passenger.profilePicture ? passenger.profilePicture : defaultProfilePic } alt="show-img" className='large-icon'/>
                        </div>
                        <div className="passenger-name">
                            <p id="firstName-passenger">{passenger.firstName}</p>
                            <p>{passenger.lastName}</p>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="passenger-dropoff">
                <p>{dropOff["streetAddress"]}</p>
                <p>{dropOff["city"]}, {dropOff["state"]} {dropOff["postalCode"]}</p>
            </div>
            <div className="passenger-phone">
                <p>{passenger.phoneNumber}</p>
            </div>
        </div>
    )
}