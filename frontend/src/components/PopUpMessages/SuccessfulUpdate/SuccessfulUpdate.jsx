import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../store/modal";

const SuccessfulUpdate = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const timer = setTimeout(() => {
            dispatch(closeModal());
        }, 1000)
    }, [])
    return (
        <div className="popup-message">
            Sucessfully updated!
        </div>
    )
}

export default SuccessfulUpdate;