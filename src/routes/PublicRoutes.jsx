import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import LoadingScreen from '../layouts/LoadingScreen'
import PublicFooter from '../layouts/PublicFooter'

const PublicRoutes = () => {
  const { loggedIn, checkingStatus } = useAuthStatus()
  if (checkingStatus) {
    return <LoadingScreen />
  }
  return !loggedIn ? (
    <>
      <main className='grid place-content-center min-h-[93vh]'>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  ) : (
    <Navigate to='/' />
  )
}

export default PublicRoutes
