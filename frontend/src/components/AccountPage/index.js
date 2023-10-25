import UserNavBar from "../AccountNavBar/UserNavBar";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import UserSettings from "./UserSettings/UserSettings";
import { useState } from "react";

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