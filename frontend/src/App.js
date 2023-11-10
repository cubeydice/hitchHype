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
import { UserTrips } from './components/AccountPage/UserTrips/UserTrips';
import { UserRides } from './components/AccountPage/UserRides/UserRides';
import ReviewForm from './components/Reviews/ReviewForm/ReviewForm';
import Profile from './components/Profile/Profile';
import CarUpdatePage from './components/CarPage/CarUpdatePage';
import InflationArticle from './components/MainPage/Articles/Inflation';
import EnvironmentArticle from './components/MainPage/Articles/Environment';
import DefaultProfilePic  from './assets/icons/user.png'

export const handleImgError = (currentTarget) => {
  currentTarget.onerror = null; //prevents looping
  currentTarget.src={DefaultProfilePic}
}

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
            <Route exact path="/save-money"component={InflationArticle} />
            <Route exact path="/environment"component={EnvironmentArticle} />
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
            <ProtectedRoute exact path="/review/:revieweeId/" component={ ReviewForm }/>
          </Switch>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]





export default App;