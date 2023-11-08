import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import stopSign from '../../../assets/images/stop-sign-png-27212.png'
import './Error.css'
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../store/modal';


const Error = () => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(closeModal())
    }

    return (
    <>
        <img className='stop-sign' src={stopSign} alt="" />
        <p className='no-car-error' >You must have a car saved in order to create a trip</p>
        <Link to='/car' onClick={handleClick}>Click here to add your car.</Link>
    </>
    )
}

export default Error