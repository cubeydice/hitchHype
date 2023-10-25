import profilePic from "../../../assets/images/profile-pic-dummy.jpg"
import "./Passenger.css"
export function Passenger({ passenger: { dropoffPoint, passenger }}){

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
                <h3>{dropoffPoint.street}</h3>
                <h3>{dropoffPoint.city}, {dropoffPoint.street} {dropoffPoint.postalCode}</h3>
            </div>
        </div>
    )
}