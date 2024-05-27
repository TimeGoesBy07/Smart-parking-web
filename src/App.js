// import HomePage from './interface/home'
import Icon from './interface/icon'
import './index.css'
import LogIn from './interface/log-in'
import SignUp from './interface/sign-up'
import { Route, Routes } from 'react-router'
import UsersList from './interface/user-list'
import UsersForm from './interface/add-user'
import UserUpdate from './interface/user-update'
import ProtectedRoute from './interface/protected'
// import MakePayment from './actions/payment'
import UserPage from './interface/user'
// import PersonalVehicles from './interface/vehicle'
import ParkingList from './interface/parking-list'
import CarParkArchitecture from './interface/park-details'
import AddParkingLot from './interface/add-park'
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import BootFooter from './interface/footer'

function App() {

    return (
        <div className='page'>
            <Routes>
                <Route path="/" element={<div><Icon /><BootFooter /></div>} />
                <Route path="/login" element={<div><LogIn /><BootFooter /></div>} />
                <Route path="/signup" element={<div><SignUp /><BootFooter /></div>} />
                <Route path="*" element={<p>Page Not Found 404</p>} />
                {/* <Route path="/homepage/*" element={<ProtectedRoute><HomePage /><BootFooter /></ProtectedRoute>} /> */}
                {/* <Route path="/payment" element={<ProtectedRoute><MakePayment /><BootFooter /></ProtectedRoute>} /> */}
                <Route path='/userForm' element={<ProtectedRoute><UsersForm /><BootFooter /></ProtectedRoute>} />
                <Route path='/parkinglist' element={<ProtectedRoute><ParkingList /><BootFooter /></ProtectedRoute>} />
                <Route path='/addparkinglot' element={<ProtectedRoute><AddParkingLot /><BootFooter /></ProtectedRoute>} />
                <Route path='/parkinglist/:id/:key' element={<ProtectedRoute><CarParkArchitecture /><BootFooter /></ProtectedRoute>} />
                {/* <Route path='/vehicles' element={<ProtectedRoute><PersonalVehicles /><BootFooter /></ProtectedRoute>} /> */}
                <Route path='/userpage' element={<ProtectedRoute><UserPage /><BootFooter /></ProtectedRoute>} />
                <Route path="/list/*" element={<ProtectedRoute><UsersList /><BootFooter /></ProtectedRoute>} />
                <Route path="/list/:uid" element={<ProtectedRoute><UserUpdate /><BootFooter /></ProtectedRoute>} />
            </Routes>
        </div>
    )
}

export default App