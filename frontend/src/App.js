import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';
import { ProtectedRoute } from './components/Routes/Routes';

import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import AccountPage from './components/AccountPage';
import Modal from './components/Modal/Modal';
import Footer from './components/Footer/Footer';
import CreateTrip from './components/CreateTrip/CreateTrip';
import CarPage from './components/CarPage';

import { getCurrentUser } from './store/session';
import { Trips } from './components/Trips/TripsIndex/Trips';
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
        <div className='main-body'>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <ProtectedRoute exact path="/account" component={AccountPage} />
          <ProtectedRoute exact path="/car" component={CarPage} />
          <Route exact path="/trips" component={ Trips } />
          <ProtectedRoute exact path="/trips/new" component={ CreateTrip } />
          <Route exact path="/trips/:tripId" component={ TripShow } />
          <ProtectedRoute exact path="/trips/:tripId/update" component={ DriverUpdateForm}/>
        </Switch>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default App;