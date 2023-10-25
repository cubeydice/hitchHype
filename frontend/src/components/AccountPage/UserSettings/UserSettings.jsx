import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../../store/users";

const UserSettings = ({sessionUser}) => {
  const dispatch = useDispatch();
  const userId = sessionUser._id;

  return (
    <>
      <h2>Tell us about yourself!</h2>
      <div className="account-update-container">

      </div>
    </>
  )
 }

 export default UserSettings;