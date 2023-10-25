import UserNavBar from "./UserNavBar/UserNavBar";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import UserSettings from "./UserSettings/UserSettings";
import { useState } from "react";

const AccountPage = () => {
  const sessionUser = useState(state => state.session.user)

  if (!sessionUser) <Redirect to="/" />

  return (
    <>
      <UserNavBar />
      <UserSettings/>
    </>
  )
}

export default AccountPage;