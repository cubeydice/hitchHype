import UserNavBar from "../AccountNavBar/UserNavBar";
import { useSelector } from "react-redux";
import CarSettings from "./CarSettings/CarSettings.jsx";
import './CarPage.css'
import CarShow from "./CarShow/CarShow";

const CarPage = () => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="settings-page-container">
      <UserNavBar />
      {sessionUser.car ? <>
        <CarShow sessionUser={sessionUser}/></> : <CarSettings sessionUser={sessionUser} fromOriginalPage={true}/>}
    </div>
  )
}

export default CarPage;