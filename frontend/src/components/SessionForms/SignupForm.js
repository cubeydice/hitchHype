import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signup, clearSessionErrors } from '../../store/session';
import { closeModal, openModal } from '../../store/modal';
import { ReactComponent as SignUpIcon} from '../../assets/icons/signup.svg'
import './SessionForm.css';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        };
    }, [dispatch]);

    const update = field => {
        let setState;

        switch (field) {
        case 'email':
            setState = setEmail;
            break;
        case 'firstName':
            setState = setFirstName;
            break;
        case 'lastName':
            setState = setLastName;
            break;
        case 'password':
            setState = setPassword;
            break;
        case 'password2':
            setState = setPassword2;
            break;
        default:
            throw Error('Unknown field in Signup Form');
        }

        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        const user = {
        firstName,
        lastName,
        email,
        password
        };

        dispatch(signup(user)).then((res) => {
            if (!res.errors) {
                dispatch(clearSessionErrors());
                dispatch(closeModal());
            }
        });
    }

    const handleClick = e => {
        e.preventDefault();
        dispatch(openModal('login-form'))
    }

    return (
        <form className="session-form" onSubmit={handleSubmit}>
            <SignUpIcon className="large-icon-unrounded"/>
            <h2>Create an account</h2> <br/>

            <label>
                <h3>First Name</h3>
                <p className="errors">{errors?.firstName}</p>
                <input type="text"
                    value={firstName}
                    onChange={update('firstName')}
                    placeholder="First Name"
                />
            </label>

            <label>
                <h3>Last Name</h3>
                <p className="errors">{errors?.lastName}</p>
                <input type="text"
                    value={lastName}
                    onChange={update('lastName')}
                    placeholder="Last Name"
                />
            </label>

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

            <label>
                <h3>Confirm Password</h3>
                <p className="errors">
                    {password !== password2 && `Confirm Password field must match`}
                </p>
                <input type="password"
                    value={password2}
                    onChange={update('password2')}
                    placeholder="Confirm Password"
                />
            </label> <br/>
            <input
                type="submit"
                value="Sign Up"
                disabled={!email || !firstName || !lastName ||!password || password !== password2}
            /> <br/>
            Already have an account? <span className='link' onClick={handleClick}>Sign in</span>
        </form>
    );
}

export default SignupForm;