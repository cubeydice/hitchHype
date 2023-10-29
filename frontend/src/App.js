import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';
import { ProtectedRoute } from './components/Routes/Routes';

import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import AccountPage from './components/AccountPage';
import Modal from './components/Modal/Modal';
import Footer from './components/Footer/Footer';
import GasPrices from './components/GasPrices/GasPrices';
import CreateTrip from './components/CreateTrip/CreateTrip';
import CarPage from './components/CarPage';

import { getCurrentUser } from './store/session';
import { Trips } from './components/Trips/TripsIndex/Trips';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import { TripShow } from './components/Trips/TripShow';
import { DriverUpdateForm } from './components/Trips/Driver/DriverTripUpdate';
import { UserTrips } from './components/UserTrips/UserTrips';
import { UserRides } from './components/UserRides/UserRides';
import Profile from './components/Profile/Profile';
import CarUpdatePage from './components/CarPage/CarUpdatePage';

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
        <div className='main-body'>
          <Switch>
            <Route exact path="/"component={MainPage} />
            <ProtectedRoute exact path="/account" component={AccountPage} />
            <ProtectedRoute exact path="/car" component={CarPage} />
            <ProtectedRoute exact path="/car/update" component={CarUpdatePage} />
            <ProtectedRoute exact path="/profile/:userId" component={ Profile } />
            <Route exact path="/trips" component={ Trips } />
            <ProtectedRoute exact path="/trips/new" component={ CreateTrip } />
            <Route exact path="/trips/:tripId" component={ TripShow } />
            <ProtectedRoute exact path="/trips/:tripId/update" component={ DriverUpdateForm}/>
            <ProtectedRoute exact path="/users/:userId/trips" component={ UserTrips }/>
            <ProtectedRoute exact path="/users/:userId/rides" component={ UserRides }/>
          </Switch>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default App;