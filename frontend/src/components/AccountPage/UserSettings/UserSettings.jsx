import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../../store/users";

const UserSettings = ({sessionUser}) => {
  const dispatch = useDispatch();
  const userId = sessionUser._id;
  const [bio, setBio] = useState('');

  return (
    <>
      <h2>Tell us about yourself!</h2>
      <div className="account-form-container">
        <form className="account-form">
          <label> About Me
            <input>
            </input>
          </label>
        </form>
      </div>
    </>
  )
 }

 export default UserSettings;