import { Navigate } from "react-router"

const ProtectedRoute = ({ redirectPath = '/', children }) => {
    const logInToken = localStorage.getItem('logInToken') === 'true'

    if (logInToken === false) {
        return <Navigate to={redirectPath} replace />
    }
    
    return children
}

export default ProtectedRoute