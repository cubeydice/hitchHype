import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../../store/modal';
import './NavBar.css';
import { logout } from '../../store/session';
import GitHubLogo from '../../assets/logos/github-mark.png'
import LinkedInLogo from '../../assets/logos/linkedin-blue.png'

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
            <div className="links-nav">
                <div className='nav-logos'>
                    <a href="#footer">
                        <img src={LinkedInLogo} alt='linkedin' className='medium-icon'/>
                    </a>
                    <a href='https://github.com/cubeydice/hitchHype/' target="_blank" rel='noreferrer'>
                        <img src={GitHubLogo} alt='github' className='medium-icon'/>
                    </a>
                </div>
                <Link to={'/profile'}>Profile</Link>
                <button onClick={logoutUser}>Logout</button>
            </div>
        );
        } else {
        return (
            <div className="links-auth">
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
            <div><h1>hitch<span className='brand-logo'>Hype</span></h1></div>
            { getLinks() }
        </nav>
        </>
    );
}

export default NavBar;