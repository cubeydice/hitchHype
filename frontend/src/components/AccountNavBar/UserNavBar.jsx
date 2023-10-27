import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import './UserNavBar.css'

const UserNavBar = () => {
  return (
    <nav className="account-nav">
      <h2>your account</h2><br/>
      <h3>Finding Yourself 🧘</h3>
      <ul>

        <NavLink to="/account"><li>Account Info</li></NavLink>
        <NavLink to="/car"><li>Driver/Car Info</li></NavLink>

      </ul>

      <h3>Your Journeys 📍</h3>
      <ul>
        <NavLink to="/your-trips"><li>Your Trips</li></NavLink>
        <NavLink to="/your-rides"><li>Your Rides</li></NavLink>
      </ul>
    </nav>
  )
}

export default UserNavBar;