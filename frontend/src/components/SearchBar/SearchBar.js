import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { fetchTripsPlaces } from "../../store/trips";
import explodeAddress from "../Trips/AddressParser";


export function SearchBar ({ searchRes = {}, setSearchRes, fromIndex = false, setSearching}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [places, setPlaces] = useState();
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
            let destinationCity;
            let originCity;
            let placesMap = res.map( trip => {
                explodeAddress(trip[1], function(err,addressStr)
                {
                    destinationCity = addressStr.city;
                })
                explodeAddress(trip[0], function(err,addressStr)
                {
                    originCity = addressStr.city;
                })
                return [originCity, destinationCity]
            })
            setPlaces(placesMap);
        });

    }, [dispatch])

    return (
        <>
            <form onSubmit={ handleSearch }>
                <input
                    type='text'
                    placeholder='Search start locations'
                    list="startOptions"
                    value={ start }
                    onChange={ e => setStart(e.target.value)}
                />
                <datalist id="startOptions">
                    <option value="New York"/>
                    <option value="San Diego"/>
                    <option value="San Francisco"/>
                </datalist>
                <input
                    type='text'
                    placeholder='Destination (optional)'
                    list="endOptions"
                    value={ end }
                    onChange={ e => setEnd(e.target.value) }
                />
                <datalist id="endOptions">
                    <option value="New York"/>
                    <option value="San Diego"/>
                    <option value="San Francisco"/>
                </datalist>
                <input type='date' 
                    value={ date }
                    onChange={ (e) => setDate(e.target.value) }
                />
                <input type='submit' value='Search'/>
            </form>
        </>
    )
}