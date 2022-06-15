import logo from '../assets/images/loading-logo.png'
import meta from '../assets/images/from-meta.png'

const LoadingScreen = () => {
  return (
    <main className='h-screen relative'>
      <img
        src={logo}
        alt='instagram'
        className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'
      />
      <img
        src={meta}
        alt='meta'
        className='absolute left-1/2 -translate-x-1/2 bottom-5 scale-50'
      />
    </main>
  )
}

export default LoadingScreen
