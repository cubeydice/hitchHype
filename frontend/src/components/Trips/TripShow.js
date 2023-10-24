import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearTripErrors, fetchTrip } from '../../store/trips';
import sfPic from "../../assets/icons/sf-img.jpg"
import "./TripShow.css"

export function TripShow () {
    const { tripId } = useParams();
    const dispatch = useDispatch();
    const trip = useSelector(state => state.trips);
    const date = new Date(trip.departureTime);
    console.log(date.toDateString())

    // console.log('in show page: ', tripId)
    useEffect( () => {
        dispatch(fetchTrip(tripId)) //.then( trip => console.log(trip))
        dispatch(clearTripErrors());
    }, [dispatch])

    return (
        <div>
            {trip.driver ? (
                <>
                    <div className='trip-show-details'>
                        <div className='trip-show-photo'>
                            <img src={sfPic} alt="show-img" id='show-img'/>
                        </div>
                        <div className='trip-show-info'>
                            <div className='trip-show-endPoint'>
                                <h3>Destination is {trip.endPoint}.</h3>
                            </div>
                            <div className='trip-show-StartPoint'>
                                <h3>Departing from {trip.startPoint}.</h3>
                            </div>
                            <div className='trip-show-departure-time'>
                                <h3>Trip will take place on {date.toDateString()}.</h3>
                            </div>
                            <div className='trip-show-spots'>
                                <h3>Their are {trip.availableSeats} available seats on this trip.</h3>
                            </div>
                        </div>
                    </div>
                    <div className='trip-show-driver-details'>
                        <div className='trip-show-driver-name'>
                            <h3>{trip.driver.firstName}</h3>
                            <h3>{trip.driver.lastName}</h3>
                        </div>
                        <div className='trip-show-driver-'></div>
                    </div>
                </>
            ) : (
                <></>
            )}

        </div>
    )
}