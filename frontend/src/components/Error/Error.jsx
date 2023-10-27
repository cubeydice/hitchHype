import stopSign from '../../assets/images/stop-sign-png-27212.png'
import './Error.css'


const Error = () => {
    return (
    <>
        <img className='stop-sign' src={stopSign} alt="" />
        <p className='no-car-error' >You must have a car saved in order to create a trip</p>
    </>
    )
}

export default Error