import UserNavBar from "../AccountNavBar/UserNavBar";
import { useSelector } from "react-redux";
import UserSettings from "./UserSettings/UserSettings";

const AccountPage = () => {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
      <UserNavBar />
      <UserSettings sessionUser={sessionUser}/>
    </>
  )
}

export default AccountPage;