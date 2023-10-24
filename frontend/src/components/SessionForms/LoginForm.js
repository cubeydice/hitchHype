import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, clearSessionErrors } from '../../store/session';
import { closeModal } from '../../store/modal';
import { ReactComponent as LoginIcon} from '../../assets/icons/login.svg'
import './SessionForm.css';

function LoginForm () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    // console.log(errors)
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
                console.log(res)
                if (!res.errors) {
                    dispatch(clearSessionErrors());
                    dispatch(closeModal());
                };
            });
    }

    return (
        <form className="session-form" onSubmit={handleSubmit}>
        <LoginIcon className='large-icon'/> <br/>
        <h2>Log in and start your trip!</h2> <br/>
        <div>
            <label>
                <h3>Email</h3> <span className="errors">{errors?.email}</span><br/>
                <input type="text"
                value={email}
                onChange={update('email')}
                placeholder="Email"
                />
            </label>
            <br/> <br/>
            <label>
                <h3>Password</h3> <span className="errors">{errors?.password}</span><br/>
                <input type="password"
                value={password}
                onChange={update('password')}
                placeholder="Password"
                />
            </label> <br/>
        </div> <br/>
        <input
            type="submit"
            value="Log In"
            disabled={!email || !password}
        /><br/><br/>
            Don't have an account? <span className='link'>Register</span>
        </form>
    );
}

export default LoginForm;