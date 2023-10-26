import UserNavBar from "../AccountNavBar/UserNavBar";
import { useSelector } from "react-redux";
import CarSettings from "./CarSettings/CarSettings.jsx";
import './CarPage.css'

const CarPage = () => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="settings-page-container">
      <UserNavBar />
      <CarSettings sessionUser={sessionUser}/>
    </div>
  )
}

export default CarPage;