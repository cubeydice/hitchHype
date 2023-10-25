import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';

import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import Profile from './components/Profile/Profile';
import Modal from './components/Modal/Modal';
import Footer from './components/Footer/Footer';

import { getCurrentUser } from './store/session';

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
        <ProtectedRoute exact path="/profile" component={Profile} />
      </Switch>
      </div>
      <Footer/>
    </div>
  );
}

export default App;