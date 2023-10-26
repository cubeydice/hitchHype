import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserErrors, updateUser } from "../../../store/users";
import './CarSettings.css'
import jwtFetch from "../../../store/jwt";

const CarSettings = ({sessionUser}) => {
  const dispatch = useDispatch();
  let user = sessionUser;
  let car;

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [insurance, setInsurance] = useState('');
  const [licensePlateNumber, setLicensePlateNumber] = useState('');

// let makeOptions = jwtFetch(`/api/cars/list`).then(res => {
//     console.log(res)})
//     console.log(makeOptions)
  const [modelOptions, setModelOptions] = useState('');
  const [yearOptions, setYearOptions] = useState('');

  const handleChange = (field) => (e) => {
    e.preventDefault();

    switch (field) {
      case 'make':
        setMake(e.currentTarget.value);
        break;
      case 'model':
        setModel(e.currentTarget.value);
        break;
      case 'year':
        setYear(e.currentTarget.value);
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

    user = {
      ...user,
    }

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
        <form className="car-form" onSubmit={handleSubmit}>
          <label> Make
            <input type="text"
            name="make"
            value={make}
            onChange={handleChange('make')}/>
          </label>
          <label> Model
            <input type="text"
            name="model"
            value={model}
            onChange={handleChange('model')}/>
          </label>
          <label> Year
            <input type="number"
            name="year"
            value={year}
            onChange={handleChange('year')}/>
          </label>

          <label> Insurance
            <input type="text"
            name="insurance"
            value={insurance}
            onChange={handleChange('insurance')}/>
          </label>
          <label> License Plate Number
            <input type="text"
            name="license-plate-number"
            value={licensePlateNumber}
            onChange={handleChange('licensePlateNumber')}/>
          </label>
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