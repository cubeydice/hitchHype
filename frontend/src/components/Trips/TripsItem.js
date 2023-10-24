

export function TripsItem ({ trip }) {
    const showPage = '/trips/' + trip._id;
    const price = '$0'

    return (
        <a href={ showPage } className="TripItem-container">
            <div className="TripItem-photo">
                {/* {trip.photo} */}
            </div>
            <div className="TripItem-details">
                <div className="TripItem-destination">
                    { trip.endPoint }
                </div>
                <div className="TripItem-price">
                    { price }
                </div>
            </div>
        </a>
    )
}