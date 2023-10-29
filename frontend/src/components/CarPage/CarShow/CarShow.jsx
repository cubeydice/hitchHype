import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserErrors, updateUser } from "../../../store/users";
import CarImage from '../../../assets/images/car-3046424_1920.jpg'
import './CarShow.css'
import { fetchCar } from "../../../store/cars";
import { Link } from "react-router-dom/cjs/react-router-dom";

const CarShow = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  let carId = user.car;
  let car = useSelector(state => state.cars)[0];

  useEffect(() => {
    dispatch(fetchCar(carId))
  }, [dispatch, carId])

  return (
    <div className="settings-container">
      <h1 className="settings-form-title">Your <span className="italic">sweet ride</span> 🚙💨</h1>
      <div className="car-form-container">
        <div>
          <img src={CarImage} alt='car'/>
        </div>

        <div className="car-form">
            <h3>Insurance</h3>
            {car ? car.insurance : ""}
            <h3>Make</h3>
            {car ? car.make : ""}
            <h3>Model</h3>
            {car ? car.model : ""}
            <h3>Year</h3>
            {car ? car.year : ""}
            <h3>Average MPG</h3>
            {car ? car.mpg : ""}
        <button><Link to='/car/update'>Update your car</Link></button>
        </div>
    </div>
    </div>
  )
 }

 export default CarShow;