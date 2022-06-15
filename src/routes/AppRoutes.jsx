import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import PrivateRoute from './PrivateRoutes'
import Signup from '../auth/Signup'
import Login from '../auth/Login'
import ForgotPassword from '../auth/ForgotPassword'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import EditProfile from '../pages/EditProfile'
import UsersProfile from '../pages/UsersProfile'
import DM from '../pages/DM'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/userprofile' element={<Profile />} />
          <Route path='/editprofile' element={<EditProfile />} />
          <Route path='/users/:id' element={<UsersProfile />} />
          <Route path='/dm' element={<DM />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes
