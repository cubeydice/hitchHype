import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signup, clearSessionErrors } from '../../store/session';
import { closeModal } from '../../store/modal';
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

    return (
        <form className="session-form" onSubmit={handleSubmit}>
            <SignUpIcon className="large-icon"/> <br/>
            <h2>Create an account</h2> <br/>

            <label>
                <h3>First Name</h3>
                <span className="errors">{errors?.firstName}</span><br/>
                <input type="text"
                    value={firstName}
                    onChange={update('firstName')}
                    placeholder="First Name"
                />
            </label>

            <label><br/><br/>
                <h3>Last Name</h3>
                <span className="errors">{errors?.lastName}</span><br/>
                <input type="text"
                    value={lastName}
                    onChange={update('lastName')}
                    placeholder="Last Name"
                />
            </label>

            <label><br/><br/>
                <h3>Email</h3>
                <span className="errors">{errors?.email}</span><br/>
                <input type="text"
                value={email}
                onChange={update('email')}
                placeholder="Email"
                />
            </label>

            <label><br/><br/>
                <h3>Password</h3>
                <span className="errors">{errors?.password}</span><br/>
                <input type="password"
                    value={password}
                    onChange={update('password')}
                    placeholder="Password"
                />
            </label>

            <label><br/><br/>
                <h3>Confirm Password</h3><br/>
                <span className="errors">
                    {password !== password2 && 'Confirm Password field must match'}
                </span>
                <input type="password"
                    value={password2}
                    onChange={update('password2')}
                    placeholder="Confirm Password"
                />
            </label> <br/><br/>
            <input
                type="submit"
                value="Sign Up"
                disabled={!email || !firstName || !lastName ||!password || password !== password2}
            />
        </form>
    );
}

export default SignupForm;