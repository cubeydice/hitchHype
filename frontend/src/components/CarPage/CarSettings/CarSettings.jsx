import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserErrors, updateUser } from "../../../store/users";
import { ReactComponent as Loading } from "../../../assets/icons/loading-icon.svg"
import './CarSettings.css'

const CarSettings = ({sessionUser}) => {
  const dispatch = useDispatch();
  let user = sessionUser;
  let car;

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [insurance, setInsurance] = useState('');
  const [licensePlateNumber, setLicensePlateNumber] = useState('');

  const [makeOptions, setMakeOptions] = useState('');
  const [modelOptions, setModelOptions] = useState('');
  const [yearOptions, setYearOptions] = useState('');
  const [makeOptionsReady, setMakeOptionsReady] = useState(true)
  const [mpgList, setMpgList] = useState('')

  useEffect(()=>{
    if (makeOptions !== '') setModelOptions(makeOptions[make]);
  }, [make, modelOptions])

  useEffect(()=>{
    if (modelOptions !== '') setYearOptions(modelOptions[model]);
  }, [model, yearOptions])

  const getMakeOptions = async () => {
    const res = await fetch(`/api/cars/list`);
    const data = await res.json();
    if (makeOptions === '') {
      setMakeOptions(data.vehicles)
      setMakeOptionsReady(false)
      setMpgList(data.mpg)
    };
  }

  if (makeOptions === '') getMakeOptions();

  const handleChange = (field) => (e) => {
    e.preventDefault();

    switch (field) {
      case 'make':
        setMake(e.currentTarget.value);
        setModel("")
        break;
      case 'model':
        setModel(e.currentTarget.value);
        setYear("")
        break;
      case 'year':
        setYear(e.target.value);
        break;
      case 'insurance':
        setInsurance(e.currentTarget.value);
        break;
      case 'licensePlateNumber':
        setLicensePlateNumber(e.currentTarget.value);
        break;
      default:
        break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    car = {
        ...car,
        make,
        model,
        year,
        insurance,
        licensePlateNumber
    }

    dispatch(updateUser(user))
    .then((res)=> {
      if (res && !res.errors) {
          dispatch(clearUserErrors());
      };
  });
  }

  return (
    <>
      <h2>{`Tell us about your sweet ride 🚙💨`}</h2>
      <div className="car-form-container">
        <h3>You need a car to create a trip!</h3>
        <form className="car-form" onSubmit={handleSubmit}>
        <label> <h3>Insurance</h3>
            <input type="text"
            name="insurance"
            value={insurance}
            onChange={handleChange('insurance')}/>
          </label>
          <label> <h3>License Plate Number</h3>
            <input type="text"
            name="license-plate-number"
            value={licensePlateNumber}
            onChange={handleChange('licensePlateNumber')}/>
          </label>
          { !makeOptionsReady ? <div> <label> <h3>Make</h3>
            <select onChange={handleChange('make')} autoFocus disabled={makeOptionsReady} required>
              <option value=""></option>
              {Object.keys(makeOptions).sort().map(make => <option value={make}>{make}</option>)}
            </select>
          </label>
          <label> <h3>Model</h3>
          <select onChange={handleChange('model')} disabled={makeOptionsReady}>
            <option value=""></option>
              {modelOptions ?
              Object.keys(modelOptions).sort().map(make => <option value={make}>{make}</option>)
              : ''}
            </select>
          </label>
          <label> <h3>Year</h3>
            <select onChange={handleChange('year')} disabled={makeOptionsReady}>
              <option value=""></option>
                {yearOptions ?
                Object.keys(yearOptions).sort().map(make => <option value={make}>{make}</option>)
                : <Loading/>}
            </select>
          </label>
          <label> <h3>Average MPG</h3>
            {mpgList[yearOptions[year]]}
          </label> </div> : <div><h3>Loading vehicle options...</h3><Loading/><br/></div>}
          <input
          type="submit"
          value="Save"
          />
        </form>
      </div>
    </>
  )
 }

 export default CarSettings;