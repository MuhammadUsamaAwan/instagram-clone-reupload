import { useState, useMemo, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase.config'
import logo from '../assets/images/logo.png'
import appleStore from '../assets/images/app-store.png'
import googlePlay from '../assets/images/google-play.png'
import facebook from '../assets/images/facebook-purple.png'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  // states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordShow, setPasswordShow] = useState(false)
  const [allowSubmit, setAllowSubmit] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // hooks
  const navigate = useNavigate()

  // regex
  const emailRegex = useMemo(() => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, [])
  const passwordRegex = useMemo(
    () => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/,
    []
  )

  // check if submit allowed
  useEffect(() => {
    if (email.match(emailRegex) && password.match(passwordRegex))
      setAllowSubmit(true)
    else setAllowSubmit(false)
  }, [email, password, emailRegex, passwordRegex])

  // submit function
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setSubmitError(err.code)
      return
    }
    navigate('/')
  }

  // login with facebook
  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName,
        userName: user.displayName.replace(/ /g, ''),
        timestamp: serverTimestamp(),
        photoURL: user.photoURL,
      })
    }
    navigate('/')
  }

  return (
    <div className='max-w-[21.875rem]'>
      {/* signup form */}
      <form
        className='border-0 sm:border border-gainsboro bg-current sm:bg-white p-10 pb-4 text-center flex flex-col items-center justify-center'
        onSubmit={e => handleSubmit(e)}
      >
        {/* instagram logo */}
        <img src={logo} alt='instagram' className='mb-8' />
        {/* input fields */}
        {/* email */}
        <div className='relative bg-lotion w-full border border-gainsboro py-[0.4375rem] rounded-sm my-1.5'>
          <label
            className={`${
              email
                ? '-translate-y-[90%] text-[0.625rem]'
                : '-translate-y-1/2 text-xs'
            } absolute text-philippinegray left-2 top-1/2 pointer-events-none z-10 transition-all duration-75 ease-linear`}
          >
            Phone Number, username, or Email
          </label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`${
              email && 'text-xs translate-y-1.5'
            } w-full bg-lotion outline-0 px-2  transition-all duration-75 ease-linear`}
          />
        </div>
        {/* password */}
        <div className='relative bg-lotion w-full border border-gainsboro py-[0.4375rem] rounded-sm mb-1.5'>
          <label
            className={`${
              password
                ? '-translate-y-[90%] text-[0.625rem]'
                : '-translate-y-1/2 text-xs'
            } absolute text-philippinegray left-2 top-1/2 pointer-events-none z-10 transition-all duration-75 ease-linear`}
          >
            Password
          </label>
          <input
            value={password}
            type={passwordShow ? 'text' : 'password'}
            onChange={e => setPassword(e.target.value)}
            className={`${
              password && 'text-xs translate-y-1.5'
            } w-full bg-lotion outline-0 px-2  transition-all duration-75 ease-linear`}
          />
          <button
            type='button'
            className='font-semibold absolute top-1/2 -translate-y-1/2 right-2'
            onClick={() => setPasswordShow(passwordShow => !passwordShow)}
          >
            {passwordShow && password && 'Hide'}
            {!passwordShow && password && 'Show'}
          </button>
        </div>
        {/* submit */}
        <button
          className={`${
            allowSubmit
              ? 'bg-vividcerulean cursor-pointer'
              : 'bg-freshair pointer-event-none'
          } w-full my-2.5 py-[0.3125rem] rounded text-white font-semibold`}
          disabled={!allowSubmit}
        >
          Log in
        </button>
        {/* or */}
        <div className='grid grid-cols-[6.8125rem_auto_6.8125rem] items-center my-2.5'>
          <div className='bg-gainsboro h-[1px]'></div>
          <div className='text-[0.8125rem] font-semibold text-philippinegray mx-4'>
            OR
          </div>
          <div className='bg-gainsboro h-[1px]'></div>
        </div>
        {/* login with facebook */}
        <button
          type='button'
          className='flex items-center justify-center my-2.5'
          onClick={loginWithFacebook}
        >
          <img src={facebook} alt='facebook' />
          <p className='text-metallicblue font-semibold ml-1'>
            Log in with Facebook
          </p>
        </button>

        {/* submit error */}
        {submitError && <p className='text-desire my-1.5'>{submitError}</p>}

        {/* forgot password */}
        <Link to='/forgotpassword' className='text-metallicblue text-xs mt-2.5'>
          Forgot Password?
        </Link>
      </form>

      {/* signup instead */}
      <div className='border-0 sm:border border-gainsboro bg-current sm:bg-white py-6 text-center flex items-center justify-center mt-2.5'>
        <p>Don't have an account?</p>
        <Link to='/signup' className='text-vividcerulean ml-1'>
          Sign up
        </Link>
      </div>

      {/* get the app */}
      <div>
        <p className='text-center my-5'>Get the app.</p>
        <div className='flex items-center justify-center'>
          <img src={appleStore} alt='apple store' className='h-10 mr-2' />
          <img src={googlePlay} alt='google play' className='h-10' />
        </div>
      </div>
    </div>
  )
}

export default Login
