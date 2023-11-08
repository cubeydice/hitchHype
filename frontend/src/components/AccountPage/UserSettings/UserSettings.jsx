import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserErrors, fetchUser, updateUser } from "../../../store/users";
import AccountImage from '../../../assets/images/eddy-billard-Y8lhl6j_OUU-unsplash.jpg' // eslint-disable-next-line
import './UserSettings.css'
import { getCurrentUser } from "../../../store/session";
import { handleImgError } from "../../../App";
import { ReactComponent as Loading } from '../../../assets/icons/loading-icon.svg'

const UserSettings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user)
  const user = useSelector(state => state.users.user)
  const errors = useSelector(state => state.errors.users);
  const [bio, setBio] = useState(user ? user.biography : '');
  const [bioCount, setBioCount] = useState(0);
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(()=>{
    if (!user) {dispatch(fetchUser(currentUser._id))
    .then(res => {
      setBio(res.user.biography)
      if (res.user.biography) setBioCount(res.user.biography.length)
      setPhone(res.user.phoneNumber)
      setProfilePicture(res.user.profilePicture)
    })} else{
      setBio(user.biography)
      if (user.biography) setBioCount(user.biography.length)
      setPhone(user.phoneNumber)
      setProfilePicture(user.profilePicture)
    }
    // eslint-disable-next-line
  }, [dispatch])

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

    const updatedUser = {
      ...user,
      biography: bio,
      phoneNumber: phone,
      profilePicture
    }

    dispatch(updateUser(updatedUser))
    .then((res)=> {
      if (res && !res.errors) {
        dispatch(getCurrentUser())
        dispatch(clearUserErrors());
      };
  });
  }

  if (!currentUser || !user) return <div><Loading/></div>
  return (
    <div className="settings-container">
      <h1 className="settings-form-title">Tell us about yourself!</h1>
      <div className="account-form-container">
        <img src={AccountImage} alt='account'/>
        <form className="account-form" onSubmit={handleSubmit}>
          <h2>
            <img src={profilePicture}
            alt='profile-pic'
            className="large-icon"
            id="profile-icon"
            onError={handleImgError}/>
            hello {currentUser.firstName} {currentUser.lastName}!
            </h2><br/>

          <label id='account-form-phone-number'><h3>Phone Number</h3> <span className="errors">{errors?.phone}</span><br/>
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