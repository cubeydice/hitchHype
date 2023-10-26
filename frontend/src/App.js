import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';

import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import Profile from './components/Profile/Profile';
import Modal from './components/Modal/Modal';
import Footer from './components/Footer/Footer';
import CreateTrip from './components/CreateTrip/CreateTrip';

import { getCurrentUser } from './store/session';
import { Trips } from './components/Trips/TripsIndex/Trips';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import { TripShow } from './components/Trips/TripShow';
import { DriverUpdateForm } from './components/Trips/Driver/DriverTripUpdate';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).then(() => setLoaded(true));
  }, [dispatch]);

  return loaded && (
    <div className='main-container'>
      <Modal />
      <div className='main-content'>
      <NavBar />
      <Switch>
        <AuthRoute exact path="/" component={MainPage} />
        <Route exact path="/trips" component={ Trips } />
        <ProtectedRoute exact path="/trips/new" component={ CreateTrip } />
        <Route exact path="/trips/:tripId" component={ TripShow } />
        <ProtectedRoute exact path="/trips/:tripId/update" component={ DriverUpdateForm}/>
      </Switch>
      </div>
      <Footer/>
    </div>
  );
}

export default App;