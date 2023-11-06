import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


export function SearchBar ({ searchRes = {}, setSearchRes, fromIndex = false, setSearching}) {
    const history = useHistory()
    const [start, setStart] = useState( searchRes.startPoint ? (searchRes.startPoint) : ("") ) 
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