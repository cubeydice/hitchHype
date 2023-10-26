import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserErrors, fetchCurrentUser, fetchUser, updateUser } from "../../../store/users";
import './UserSettings.css'
import { getCurrentUser } from "../../../store/session";

const UserSettings = ({sessionUser}) => {
  const dispatch = useDispatch();
  const errors = useSelector(state => state.errors.users);
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
      // ...user,
      biography: bio,
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
      <h2>Tell us about yourself!</h2>
      <div className="account-form-container">
        <form className="account-form" onSubmit={handleSubmit}>
          <label> About Me <span className="errors">{errors?.biography}</span><br/>
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