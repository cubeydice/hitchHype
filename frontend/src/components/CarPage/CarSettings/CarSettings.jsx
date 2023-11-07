import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserErrors, updateUser } from "../../../store/users";
import { clearCarErrors, createCar, fetchCar } from "../../../store/cars";
import { ReactComponent as Loading } from "../../../assets/icons/loading-icon.svg"
import CarImage from '../../../assets/images/car-3046424_1920.jpg'
import './CarSettings.css'

const CarSettings = () => {
  const dispatch = useDispatch();

  //Selecting Car
  const user = useSelector(state => state.session.user)
  let carId;
  if (user) if (user.car) carId = user.car;
  let car = useSelector(state => state.cars)[0];


  //User States for Car information
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [insurance, setInsurance] = useState('');
  const [licensePlateNumber, setLicensePlateNumber] = useState('');
  const userErrors = useSelector(state => state.errors.users);
  const carErrors = useSelector(state => state.errors.cars);

  //Use States for Fetching Car information
  const [makeOptions, setMakeOptions] = useState('');
  const [modelOptions, setModelOptions] = useState('');
  const [yearOptions, setYearOptions] = useState('');
  const [makeOptionsReady, setMakeOptionsReady] = useState(true)
  const [mpgList, setMpgList] = useState('')
  const [fuelEconomyId, setFuelEconomyId] = useState(0)

  //Display Insurance and License Plate if information exists
  useEffect(() => {
    dispatch(fetchCar(carId)).then(car => {
      if (user.car) {
        if (car){
          setInsurance(car[0].insurance);
          setLicensePlateNumber(car[0].licensePlateNumber);
          setMake(car[0].make);
          setModel(car[0].model);
          setYear(car[0].year);
          setFuelEconomyId(car[0].fueleconomyId)
        }
      }
    })
    // eslint-disable-next-line
  }, [dispatch, carId])

  //Update form for car options
  useEffect(()=>{
    if (makeOptions !== '') setModelOptions(makeOptions[make]);
     // eslint-disable-next-line
  }, [make, modelOptions])

  useEffect(()=>{
    if (modelOptions !== '') setYearOptions(modelOptions[model]);
     // eslint-disable-next-line
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

  //Form field handling
  const handleChange = (field) => (e) => {
    e.preventDefault();

    switch (field) {
      case 'make':
        setMake(e.currentTarget.value);
        setModel("")
        setYear("")
        break;
      case 'model':
        setModel(e.currentTarget.value);
        setYear("")
        break;
      case 'year':
        setYear(e.currentTarget.value);
        setFuelEconomyId(yearOptions[e.currentTarget.value])
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
        licensePlateNumber,
        fueleconomyId: fuelEconomyId
    }

    dispatch(updateUser(user))
    .then((res)=> {
      if (res && !res.errors) {
          dispatch(clearUserErrors());
      };
    });

    dispatch(createCar(car))
    .then((res)=> {
      if (res && !res.errors) {
          dispatch(clearCarErrors());
      };
    });
  }

  return (
    <>
    <div className="settings-container">
      <h1 className="settings-form-title">Tell us about your <span className="italic">sweet ride</span> 🚙💨</h1>
      <div className="car-form-container">
        <div>
          <img src={CarImage} alt='car'/>
        </div>
        <form className="car-form" onSubmit={handleSubmit}>
        <h3>You need a car to create a trip!</h3>
        <label>
          <h3>Insurance</h3>
          <span className="errors">{userErrors?.insurance}</span>
          <input type="text"
          name="insurance"
          value={insurance}
          onChange={handleChange('insurance')}/>
        </label>
        <label>
          <h3>License Plate Number</h3>
          <input type="text"
          name="license-plate-number"
          value={licensePlateNumber}
          onChange={handleChange('licensePlateNumber')}/>
        </label>

        {!makeOptionsReady ?
          <div className="car-form-dropdown">
            <label>
              <h3>Make</h3>
              <span className="errors">{carErrors?.make}</span>
              <select onChange={handleChange('make')} autoFocus disabled={makeOptionsReady} required>
                <option value={make}></option>
                {Object.keys(makeOptions).sort().map(make => <option value={make}>{make}</option>)}
              </select>
            </label>

            <label>
              <h3>Model</h3>
              <span className="errors">{carErrors?.model}</span>
              <select onChange={handleChange('model')} disabled={makeOptionsReady}>
                <option value={model}></option>
                {modelOptions ?
                Object.keys(modelOptions).sort().map(model => <option value={model}>{model}</option>)
                : ''}
              </select>
            </label>

            <label>
              <h3>Year</h3>
              <span className="errors">{carErrors?.year}</span>
              <select onChange={handleChange('year')} disabled={makeOptionsReady}>
                <option value={year}></option>
                  {yearOptions ?
                  Object.keys(yearOptions).sort().map(year => <option value={year}>{year}</option>) :''}
              </select>
            </label>
            <label> <h3>Average MPG</h3>
              {year ? mpgList[yearOptions[year]] :""}
            </label>
          </div>
          : <div><h3>Loading vehicle options...</h3><Loading/><br/></div>}

          <input
          type="submit"
          value="Save"
          disabled={!make || !model || !year ||!insurance || !licensePlateNumber }
          />
        </form>
      </div>
    </div>
    </>
  )
 }

 export default CarSettings;