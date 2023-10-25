import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearTripErrors, fetchTrip } from '../../store/trips';
import { DriverTripShow } from './DriverTripShow';
import { RiderTripShow } from './RiderTripShow';

export function TripShow () {
    const { tripId } = useParams();
    const dispatch = useDispatch();
    const trip = useSelector(state => state.trips);
    // const sesionUser = useSelector(state => state.session.user);
    const date = new Date(trip.departureTime);
    console.log(date.toDateString())

    useEffect( () => {
        dispatch(fetchTrip(tripId)) //.then( trip => console.log(trip))
        dispatch(clearTripErrors());
    }, [dispatch])

    return (
        <div>
            {trip ? (
                <>
                    <DriverTripShow trip={trip}/>
                    {/* <RiderTripShow trip={trip}/> */}
                </>
            ) : (
                <></>
            )}
        </div>
    )
}