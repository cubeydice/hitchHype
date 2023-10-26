import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { clearUserErrors, fetchUser } from "../../store/users";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const user = useSelector(state => state.users)

    useEffect(() => {
        dispatch(fetchUser(userId))
        dispatch(clearUserErrors());
    },
    [userId, dispatch])

    return (
        <>
        </>
    )
}

export default ProfilePage;