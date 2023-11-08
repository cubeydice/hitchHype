import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearTripErrors, fetchTrip } from '../../store/trips';
import { DriverTripShow } from './Driver/DriverTripShow';
import { RiderTripShow } from './Rider/RiderTripShow';
import './TripShow.css'

export function TripShow () {
    const { tripId } = useParams();
    const dispatch = useDispatch();
    const trip = useSelector(state => state.trips);
    const sesionUser = useSelector(state => state.session.user);

    useEffect( () => {
        dispatch(fetchTrip(tripId))
        dispatch(clearTripErrors());
    }, [dispatch, tripId])

    return (
        <div>
            {trip.driver && sesionUser ? (
                <>
                    { sesionUser._id === trip.driver._id ? (
                        <DriverTripShow trip={trip}/>
                    ) : (
                        // <DriverTripShow trip={trip}/>
                        <div className='rider-show'>
                            <RiderTripShow trip={trip}/>
                        </div>
                    )}
                </>
            ) : (
                // <></>
                <RiderTripShow trip={trip}/>
            )}
        </div>
    )
}