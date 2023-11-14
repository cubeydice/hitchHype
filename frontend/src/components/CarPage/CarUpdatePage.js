import UserNavBar from "../AccountNavBar/UserNavBar";
import { useSelector } from "react-redux";
import CarSettings from "./CarSettings/CarSettings.jsx";
import './CarPage.css'

const CarUpdatePage = () => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="settings-page-container">
      <UserNavBar />
      <CarSettings fromOriginalPage={true}/>
    </div>
  )
}

export default CarUpdatePage;