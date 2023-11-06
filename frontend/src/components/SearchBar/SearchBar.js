import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


export function SearchBar ({ searchRes = {}, fromIndex = false, setSearching}) {
    const history = useHistory()
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    const [date, setDate] = useState();

    const handleSearch = (e) => {
        e.preventDefault()
        searchRes["startPoint"] = start;
        searchRes["endPoint"] = end;
        searchRes["tripDate"] = date;

        if(!fromIndex){
            // console.log(fromIndex)
            // console.log(searchRes)
            history.push("/trips", { search: searchRes})
        }else{
            setSearching(true)
            // console.log(searchRes)
            // console.log(fromIndex)
        }
    }

    return (
        <>
            <form onSubmit={ handleSearch }>
                <input
                    type='text'
                    placeholder='Search start locations'
                    value={ start }
                    onChange={ e => setStart(e.target.value)}
                />
                <input
                    type='text'
                    placeholder='Destination (optional)'
                    value={ end }
                    onChange={ e => setEnd(e.target.value) }
                />
                <input type='date' 
                    value={ date }
                    onChange={ (e) => setDate(e.target.value) }
                />
                <input type='submit' value='Search'/>
            </form>
        </>
    )
}