import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchTripsPlaces } from "../../store/trips";
import explodeAddress from "../Trips/AddressParser";
import "./SearchBar.css"

export function SearchBar ({ searchRes = {}, setSearchRes, fromIndex = false, setSearching}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [origins, setOrigins] = useState();
    const [destinations, setDestinations] = useState();
    const [start, setStart] = useState( searchRes.startPoint ? (searchRes.startPoint) : ("") ); 
    const [end, setEnd] = useState("");
    const [date, setDate] = useState("");
    
    const handleSearch = (e) => {
        e.preventDefault()
        searchRes["startPoint"] = start;
        searchRes["endPoint"] = end;
        searchRes["tripDate"] = date;
        
        if(!fromIndex){
            history.push("/trips", { search: searchRes})
        }else{
            setSearching(true)
            setSearchRes(searchRes)
        }
    }

    useEffect(() => {
        dispatch(fetchTripsPlaces()).then( res => {
            let destinationCities = [];
            let originCities = [];
            res.map( trip => {
                explodeAddress(trip[1], function(err,addressStr)
                {
                    if(!destinationCities.includes(addressStr.city)){
                        destinationCities.push(addressStr.city);
                    }
                })
                explodeAddress(trip[0], function(err,addressStr)
                {
                    if(!originCities.includes(addressStr.city)){
                        originCities.push(addressStr.city);
                    }
                })
            })
            setOrigins(originCities.sort())
            setDestinations(destinationCities.sort());
        });

    }, [dispatch])

    return (
        <>
            {origins && destinations? (
                <>
                    <form onSubmit={ handleSearch }>
                        <input
                            type='text'
                            placeholder='Search start locations'
                            list="startOptions"
                            value={ start }
                            onChange={ e => setStart(e.target.value)}
                        />
                        <datalist id="startOptions" className="options-dropdown">
                            {origins.map(origin => <option value={origin} key={origin}>{origin}</option>)}
                        </datalist>
                        <input
                            type='text'
                            placeholder='Destination (optional)'
                            list="endOptions"
                            value={ end }
                            onChange={ e => setEnd(e.target.value) }
                        />
                        <datalist id="endOptions" className="options-dropdown">
                            {destinations.map(destination => <option value={destination} key={destination}>{destination}</option>)}
                        </datalist>
                        <input type='date' 
                            value={ date }
                            onChange={ (e) => setDate(e.target.value) }
                        />
                        <input type='submit' value='Search'/>
                    </form>
                </>
            ) : (
                <></>
            )}
        </>
    )
}