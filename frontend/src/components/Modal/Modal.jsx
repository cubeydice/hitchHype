import { closeModal } from '../../store/modal'
import { useSelector, useDispatch} from 'react-redux';
import LoginForm from '../SessionForms/LoginForm'
import SignupForm from '../SessionForms/SignupForm'
import SuccessfulUpdate from '../PopUpMessages/SuccessfulUpdate/SuccessfulUpdate';
import { RiderRequestForm } from '../Trips/Rider/RiderRequestForm';
import './Modal.css'
import Error from '../PopUpMessages/NeedCarForTripError/Error';

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
      case 'error':
        component = <Error />;
        break;
      case 'request-ride-form':
        component = <RiderRequestForm/>
        break;
        case 'successful-update':
          component = <SuccessfulUpdate/>
          break;
      case 'other':
        break;
      default:
        return null;
    }

    const handleClick = (e) => {
      dispatch(closeModal());
    }

    const setClassName = () => {
      if (modal === 'error') return 'modal-child-error'
      else if (modal === 'successful-update') return 'modal-child-update'
      else if (modal === 'request-ride-form') return 'modal-child-request-ride-form'
      else return 'modal-child';
    }

    return (
      <div
      className="modal-background"
      onClick={handleClick}>
        <div
        className={setClassName()}
        onClick={e => e.stopPropagation()}>
          { component }
        </div>
      </div>
    );
  }

  export default Modal;