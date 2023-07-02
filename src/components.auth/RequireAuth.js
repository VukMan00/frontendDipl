import {useLocation,Navigate,Outlet} from "react-router-dom"

const RequireAuth = ({allowedRoles}) =>{
   // const {auth} = useAuth();
    const location = useLocation();

    return (
        allowedRoles.includes(window.localStorage?.getItem('role'))
            ? <Outlet />
            : window.localStorage?.getItem('accessToken')
                ? <Navigate to="/unauthorized" state={{from:location}} replace />
                : <Navigate to="/login" state={{from:location}} replace />
    );
}

export default RequireAuth;