import { closeModal } from '../../store/modal'
import { useSelector, useDispatch} from 'react-redux';
import LoginForm from '../SessionForms/LoginForm'
import SignupForm from '../SessionForms/SignupForm'
import { RiderRequestForm } from '../Trips/Rider/RiderRequestForm';
import './Modal.css'

const Modal = () => {
    const modal = useSelector(state => state.modal)
    const dispatch = useDispatch();

    if (!modal) {
      return null;
    }

    let component;

    switch (modal) {
      case 'login-form':
        component = <LoginForm />;
        break;
      case 'signup-form':
        component = <SignupForm />;
        break;
      case 'request-ride-form':
        component = <RiderRequestForm/>
        break;
      case 'other':
        break;
      default:
        return null;
    }

    const handleClick = (e) => {
      dispatch(closeModal());
    }

    return (
      <div
      className="modal-background"
      onClick={handleClick}>
        <div className="modal-child" onClick={e => e.stopPropagation()}>
          { component }
        </div>
      </div>
    );
  }

  export default Modal;