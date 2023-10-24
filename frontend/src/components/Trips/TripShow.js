import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearTripErrors, fetchTrip } from '../../store/trips';

export function TripShow () {
    const { tripId } = useParams();
    const dispatch = useDispatch();
    const trip = useSelector(state => state.trips);

    console.log('in show page: ', tripId)


    useEffect( () => {
        dispatch(fetchTrip(tripId)) //.then( trip => console.log(trip))
        dispatch(clearTripErrors());
    }, [dispatch])

    return (
        <>

        </>
    )
}