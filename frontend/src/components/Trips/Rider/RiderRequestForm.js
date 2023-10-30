
import { useDispatch } from "react-redux"
import { closeModal } from "../../../store/modal"

export function RiderRequestForm(){
    const dispatch = useDispatch();

    const handleClick = () => {
        
        dispatch(closeModal());
    }

    return(
        <>
            <div className="rider-request-form-header">
                <h3>Request a Ride</h3>
            </div>
            <div className="rider-request-form-input">
                <h3>Drop off address</h3>
                <div className="rider-request-form-map-api-container">

                </div>
            </div>
            <div className="rider-request-form-btn-container">
                <button onClick={handleClick}>Request Ride</button>
            </div>
        </>
    )
}