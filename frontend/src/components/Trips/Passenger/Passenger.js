import profilePic from "../../../assets/images/profile-pic-dummy.jpg"
import "./Passenger.css"
import explodeAddress from "../AddressParser"

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
            <a href="" className="profile-link">
                <div className="passenger-profile-pic">
                    <img src={profilePic} alt="show-img" id='profile-img'/>
                </div>
                <div className="passenger-name">
                    <h3>{passenger.firstName} {passenger.lastName}</h3>
                </div>
            </a>
            <div className="passenger-dropoff">
                <h3>{dropOff["streetAddress"]}</h3>
                <h3>{dropOff["city"]}, {dropOff["state"]} {dropOff["postalCode"]}</h3>
            </div>
        </div>
    )
}