import UserNavBar from "../AccountNavBar/UserNavBar";
import { useSelector } from "react-redux";
import UserSettings from "./UserSettings/UserSettings";
import './AccountPage.css'

const AccountPage = () => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="settings-page-container">
      <UserNavBar />
      <UserSettings sessionUser={sessionUser}/>
    </div>
  )
}

export default AccountPage;