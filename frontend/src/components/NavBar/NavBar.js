import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { openModal } from '../../store/modal';
import { logout } from '../../store/session';
import GitHubLogo from '../../assets/logos/github-mark.png'
import LinkedInLogo from '../../assets/logos/linkedin-blue.png'
import './NavBar.css';

function NavBar () {
    const loggedIn = useSelector(state => !!state.session.user);
    const dispatch = useDispatch();

    const logoutUser = e => {
        e.preventDefault();
        dispatch(logout());
    }

    const handleClick = (field) => (e) => {
        e.preventDefault();

        switch (field) {
            case 'login':
                dispatch(openModal('login-form'))
                break;
            case 'signup':
                dispatch(openModal('signup-form'))
                break;
            default:
                break;
        }
    }

    const getLinks = () => {
        if (loggedIn) {
        return (
            <div className="nav-items">
                <div className='nav-logos'>
                    <a href="#footer">
                        <img src={LinkedInLogo} alt='linkedin' className='medium-icon'/>
                    </a>
                    <a href='https://github.com/cubeydice/hitchHype/' target="_blank" rel='noreferrer'>
                        <img src={GitHubLogo} alt='github' className='medium-icon'/>
                    </a>
                </div>
                <div className='nav-links'>
                    <Link to={'/trips' } className='bgless-button'>Find a Ride</Link>
                    <Link to={'/trips/new'} className='bgless-button'>Make a Trip</Link>
                    <Link to={'/account'} className='bgless-button'>Account</Link>
                </div>
                <button onClick={logoutUser}>Logout</button>
            </div>
        );
        } else {
        return (
            <div className="nav-items">
                <div className='nav-logos'>
                    <img src={LinkedInLogo} alt='linkedin' className='medium-icon'/>
                    <a href='https://github.com/cubeydice/hitchHype/' target="_blank" rel='noreferrer'>
                        <img src={GitHubLogo} alt='github' className='medium-icon'/>
                    </a>
                </div>
                <h1 onClick={handleClick('login')} className='bgless-button'>Login</h1>
                <button onClick={handleClick('signup')}>Sign up</button>
            </div>
        );
        }
    }

    return (
        <>
        <nav className='navbar'>
            <Link to={loggedIn ? '/account' : '/'}>
                <h1 className='brand-logo'>
                    hitch<span className='brand-logo'>Hype</span>
                </h1>
            </Link>
            { getLinks() }
        </nav>
        </>
    );
}

export default NavBar;