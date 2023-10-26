import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUser, updateUser } from "../../../store/users";
import './UserSettings.css'

const UserSettings = ({sessionUser}) => {
  const dispatch = useDispatch();
  const userId = sessionUser._id;
  const [bio, setBio] = useState('');
  const [bioCount, setBioCount] = useState(0);

  const handleChange = (field) => (e) => {
    e.preventDefault();

    switch (field) {
      case 'bio':
        setBio(e.currentTarget.value)
        setBioCount(e.currentTarget.value.length)
        break;
      default:
        break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      biography: bio,
    }

    dispatch(updateUser(user))
  }

  return (
    <>
      <h2>Tell us about yourself!</h2>
      <div className="account-form-container">
        <form className="account-form" onSubmit={handleSubmit}>
          <label> About Me
            <textarea
            name='bio'
            placeholder="Write something about yourself to share with other hitchHypers!"
            value={bio}
            onChange={handleChange('bio')}
            className="input-bio"
            max-length='500'
            wrap='soft'
            rows={10}
            cols={80}/>
            <sub>{`${bioCount}/500`}</sub>
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

 export default UserSettings;