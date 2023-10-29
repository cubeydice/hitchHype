import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, clearSessionErrors } from '../../store/session';
import { closeModal, openModal } from '../../store/modal';
import { ReactComponent as LoginIcon} from '../../assets/icons/login.svg'
import './SessionForm.css';

function LoginForm () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
    }, [dispatch]);

    const update = (field) => {
        const setState = field === 'email' ? setEmail : setPassword;
        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }))
            .then((res)=> {
                if (res && !res.errors) {
                    dispatch(clearSessionErrors());
                    dispatch(closeModal());
                };
            });
    }

    const handleClick = (field) => (e) => {
        e.preventDefault();

        const demoRider = {
            email:'demo-user@appacademy.io',
            password:'starwars'
        }
        const demoDriver = {
            email:'demo-user2@appacademy.io',
            password:'starwars'
        }

        switch (field) {
            case 'demo-rider':
                dispatch(login(demoRider))
                .then((res)=> {
                    if (res && !res.errors) {
                        dispatch(clearSessionErrors());
                        dispatch(closeModal());
                    };
                });
                break;
            case 'demo-driver':
                dispatch(login(demoDriver))
                .then((res)=> {
                    if (res && !res.errors) {
                        dispatch(clearSessionErrors());
                        dispatch(closeModal());
                    };
                });
                break;
            case 'register':
                dispatch(openModal('signup-form'))
                break;
            default:
                break;
        }
    }

    return (
        <form className="session-form" onSubmit={handleSubmit}>
        <LoginIcon className='large-icon' id='login-icon'/>
        <h2>Log in and start your trip!</h2> <br/>
        <div>
            <label>
                <h3>Email</h3>
                <p className="errors">{errors?.email}</p>
                <input type="text"
                value={email}
                onChange={update('email')}
                placeholder="Email"
                />
            </label>
            <label>
                <h3>Password</h3>
                <p className="errors">{errors?.password}</p>
                <input type="password"
                value={password}
                onChange={update('password')}
                placeholder="Password"
                />
            </label>
        </div>
        <input
            type="submit"
            value="Log In"
            disabled={!email || !password}
            />
        <div>
            <button onClick={handleClick('demo-rider')} className='demo-button'>Demo Rider  🙋</button>
            <button onClick={handleClick('demo-driver')} className='demo-button'>Demo Driver 🚙</button>
        </div>
            Don't have an account? <span className='link' onClick={handleClick('register')}>Sign up</span>
        </form>
    );
}

export default LoginForm;