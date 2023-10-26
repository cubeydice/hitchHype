import UserNavBar from "../AccountNavBar/UserNavBar";
import { useSelector } from "react-redux";
import CarSettings from "./CarSettings/CarSettings.jsx";

const CarPage = () => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
      <UserNavBar />
      <CarSettings sessionUser={sessionUser}/>
    </>
  )
}

export default CarPage;