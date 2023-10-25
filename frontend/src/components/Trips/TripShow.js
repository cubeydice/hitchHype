import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearTripErrors, fetchTrip } from '../../store/trips';
import { DriverTripShow } from './Driver/DriverTripShow';
import { RiderTripShow } from './RiderTripShow';

export function TripShow () {
    const { tripId } = useParams();
    const dispatch = useDispatch();
    const trip = useSelector(state => state.trips);
    // const sesionUser = useSelector(state => state.session.user);
    const date = new Date(trip.departureDate);
    // console.log(date.toDateString())

    useEffect( () => {
        dispatch(fetchTrip(tripId)).then( trip => console.log(trip))
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