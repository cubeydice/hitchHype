import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserErrors, fetchUser, updateUser } from "../../../store/users";
import AccountImage from '../../../assets/images/eddy-billard-Y8lhl6j_OUU-unsplash.jpg' // eslint-disable-next-line
import './UserSettings.css'
import { getCurrentUser } from "../../../store/session";
const UserSettings = ({sessionUser}) => {
  const dispatch = useDispatch();
  let user = sessionUser;
  const errors = useSelector(state => state.errors.users);
  const [bio, setBio] = useState('');
  const [bioCount, setBioCount] = useState(0);

  useEffect(()=>{
    fetchUser(sessionUser._id)
    if (user.biography) setBio(user.biography);
  }, [dispatch])

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

    user = {
      ...user,
      biography: bio,
    }

    dispatch(updateUser(user))
    .then((res)=> {
      if (res && !res.errors) {
        dispatch(getCurrentUser())
        dispatch(clearUserErrors());
      };
  });
  }

  return (
    <div className="settings-container">
      <h1 className="settings-form-title">Tell us about yourself!</h1>
      <div className="account-form-container">
        <img src={AccountImage} alt='account'/>
        <form className="account-form" onSubmit={handleSubmit}>
          {user.profilePicture}
          <h2>hello {user.firstName} {user.lastName}!</h2><br/>
          <label><h3>About Me</h3> <span className="errors">{errors?.biography}</span><br/>
            <textarea
            name='bio'
            placeholder="Write something about yourself to share with other hitchHypers!"
            value={bio}
            onChange={handleChange('bio')}
            className="input-bio"
            max-length='500'
            wrap='soft'
            rows={10}
            cols={80}/><br/>
            <sub>{`${bioCount}/500`}</sub>
          </label><br/>
          <input
          type="submit"
          value="Save"
          /><br/>
        </form>
      </div>
    </div>
  )
 }

 export default UserSettings;