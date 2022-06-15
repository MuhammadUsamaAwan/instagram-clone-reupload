import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import Header from '../layouts/Header'
import LoadingScreen from '../layouts/LoadingScreen'

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus()
  if (checkingStatus) {
    return <LoadingScreen />
  }
  return loggedIn ? (
    <>
      <Header />
      <main className='pt-[3.75rem]'>
        <Outlet />
      </main>
    </>
  ) : (
    <Navigate to='/login' />
  )
}

export default PrivateRoute
