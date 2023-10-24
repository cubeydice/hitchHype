import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';

import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';

import MainPage from './components/MainPage/MainPage';
import Tweets from './components/Tweets/Tweets';
import Profile from './components/Profile/Profile';
import TweetCompose from './components/Tweets/TweetCompose';
import Modal from './components/Modal/Modal';
import { getCurrentUser } from './store/session';
import { Trips } from './components/Trips/Trips';
import LoginForm from './components/SessionForms/LoginForm';
import SignupForm from './components/SessionForms/SignupForm';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).then(() => setLoaded(true));
  }, [dispatch]);

  return loaded && (
    <>
      <NavBar />
      <Modal />
      <Switch>
        <AuthRoute exact path="/" component={MainPage} />
        <AuthRoute exact path="/login" component={ LoginForm } />
        <AuthRoute exact path="/signup" component={ SignupForm } />
        <Route exact path="/tweets" component={Tweets} />
        <ProtectedRoute exact path="/profile" component={Profile} />
        <ProtectedRoute exact path="/tweets/new" component={TweetCompose} />
        <ProtectedRoute exact path="/trips" component={ Trips} />

      </Switch>
    </>
  );
}

export default App;