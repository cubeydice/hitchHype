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
  const [phone, setPhone] = useState('');

  useEffect(()=>{
    dispatch(fetchUser(sessionUser._id))
    .then(user.biography ? setBio(user.biography) : "")
    .then(user.phone ? setPhone(user.phone) : "")
  }, [dispatch, sessionUser._id, user.biography, user.phone])

  const handleChange = (field) => (e) => {
    e.preventDefault();

    switch (field) {
      case 'bio':
        setBio(e.currentTarget.value)
        setBioCount(e.currentTarget.value.length)
        break;
      case 'phone':
        setPhone(e.currentTarget.value)
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
      phoneNumber: phone
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

          <label><h3>Phone Number</h3> <span className="errors">{errors?.phone}</span><br/>
            <p className="errors">{errors?.phone}</p>
                <input type="tel"
                value={phone}
                onChange={handleChange('phone')}
                placeholder="XXX-XXX-XXXX"
                />
          </label>

          <label><h3>About Me</h3> <span className="errors">{errors?.biography}</span><br/>
            <textarea
            name='bio'
            placeholder="Write something about yourself to share with other hitchHypers!"
            value={bio}
            onChange={handleChange('bio')}
            className="input-bio"
            max-length='500'
            wrap='soft'
            rows={8}
            cols={70}/><br/>
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