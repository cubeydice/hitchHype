import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

const UserNavBar = () => {
  return (
    <nav>
      <h3>Finding Yourself</h3>
      <ul>
        <li>
          <NavLink to="/account">Account Info</NavLink>
          <NavLink to="/car">Driver/Car Info</NavLink>
        </li>
      </ul>

      <h3>Your Journeys</h3>
      <ul>
        <li>
          <NavLink to="/your-trips">Your Trips</NavLink>
          <NavLink to="/your-rides">Your Rides</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default UserNavBar;