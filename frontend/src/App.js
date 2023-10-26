import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';

import Modal from './components/Modal/Modal';
import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import AccountPage from './components/AccountPage';
import CarPage from './components/CarPage';
import Footer from './components/Footer/Footer';

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
      <Switch>
        <AuthRoute exact path="/" component={MainPage} />
        <ProtectedRoute exact path="/account" component={AccountPage} />
        <ProtectedRoute exact path="/car" component={CarPage} />
        <Route exact path="/trips/:tripId/update" component={ DriverUpdateForm}/>
        <Route exact path="/trips/:tripId" component={ TripShow } />
        <Route exact path="/trips" component={ Trips } />
      </Switch>
      </div>
      <Footer/>
    </div>
  );
}

export default App;