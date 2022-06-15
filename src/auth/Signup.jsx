import { useState, useMemo, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase.config'
import logo from '../assets/images/logo.png'
import cross from '../assets/images/cross.png'
import tick from '../assets/images/tick.png'
import appleStore from '../assets/images/app-store.png'
import googlePlay from '../assets/images/google-play.png'
import { ReactComponent as Facebook } from '../assets/icons/facebook-white.svg'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  // states
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [userName, setUserName] = useState('')
  const [userNameError, setUserNameError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
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

  // check error
  const checkEmailError = () => {
    if (email.match(emailRegex)) setEmailError(false)
    else setEmailError(true)
  }
  const checkNameError = () => {
    if (name) setNameError(false)
    else setNameError(true)
  }
  const checkUserNameError = () => {
    if (userName.length > 0 && !userName.includes(' ')) setUserNameError(false)
    else setUserNameError(true)
  }
  const checkPasswordError = () => {
    if (password.match(passwordRegex)) setPasswordError(false)
    else setPasswordError(true)
  }

  // check if submit allowed
  useEffect(() => {
    if (
      email.match(emailRegex) &&
      name &&
      userName.length > 0 &&
      !userName.includes(' ') &&
      password.match(passwordRegex)
    )
      setAllowSubmit(true)
    else setAllowSubmit(false)
  }, [email, name, userName, password, emailRegex, passwordRegex])

  // submit function
  const handleSubmit = async e => {
    e.preventDefault()
    let userCredential
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
    } catch (err) {
      setSubmitError(err.code)
      return
    }
    try {
      const user = userCredential.user
      updateProfile(auth.currentUser, {
        displayName: userName,
        photoURL:
          'https://firebasestorage.googleapis.com/v0/b/instagram-clone-4b1c1.appspot.com/o/static%2Favatar.jpg?alt=media&token=3fcf5e77-635c-484c-9bf9-35458d5a3f58',
      })
      const data = {
        email,
        name,
        userName,
        timestamp: serverTimestamp(),
        photoURL:
          'https://firebasestorage.googleapis.com/v0/b/instagram-clone-4b1c1.appspot.com/o/static%2Favatar.jpg?alt=media&token=3fcf5e77-635c-484c-9bf9-35458d5a3f58',
      }
      await setDoc(doc(db, 'users', user.uid), data)
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
        className='border-0 sm:border sm:border-gainsboro bg-current sm:bg-white p-10 text-center flex flex-col items-center justify-center'
        onSubmit={e => handleSubmit(e)}
      >
        {/* instagram logo */}
        <img src={logo} alt='instagram' />
        {/* signup heading */}
        <h2 className='text-[1.0625rem] font-semibold text-philippinegray my-2.5'>
          Sign up to see photos and videos from your friends.
        </h2>
        {/* log in with facebook */}
        <button
          type='button'
          className='bg-vividcerulean flex items-center justify-center w-full my-2.5 py-[0.3125rem] rounded'
          onClick={loginWithFacebook}
        >
          <Facebook width={22} height={22} />
          <span className='text-white font-semibold'>Log in with Facebook</span>
        </button>
        {/* or */}
        <div className='grid grid-cols-[6.8125rem_auto_6.8125rem] items-center my-2.5'>
          <div className='bg-gainsboro h-[1px]'></div>
          <div className='text-[0.8125rem] font-semibold text-philippinegray mx-4'>
            OR
          </div>
          <div className='bg-gainsboro h-[1px]'></div>
        </div>
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
            Mobile Number or Email
          </label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setEmailError(false)}
            onBlur={checkEmailError}
            className={`${
              email && 'text-xs translate-y-1.5'
            } w-full bg-lotion outline-0 px-2  transition-all duration-75 ease-linear`}
          />
          {emailError && (
            <img
              src={cross}
              alt='invalid'
              className='absolute top-1/2 -translate-y-1/2 right-2'
            />
          )}
          {!emailError && email.match(emailRegex) && (
            <img
              src={tick}
              alt='invalid'
              className='absolute top-1/2 -translate-y-1/2 right-2'
            />
          )}
        </div>
        {/* name */}
        <div className='relative bg-lotion w-full border border-gainsboro py-[0.4375rem] rounded-sm mb-1.5'>
          <label
            className={`${
              name
                ? '-translate-y-[90%] text-[0.625rem]'
                : '-translate-y-1/2 text-xs'
            } absolute text-philippinegray left-2 top-1/2 pointer-events-none z-10 transition-all duration-75 ease-linear`}
          >
            Full Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setNameError(false)}
            onBlur={checkNameError}
            className={`${
              name && 'text-xs translate-y-1.5'
            } w-full bg-lotion outline-0 px-2  transition-all duration-75 ease-linear`}
          />
          {nameError && (
            <img
              src={cross}
              alt='invalid'
              className='absolute top-1/2 -translate-y-1/2 right-2'
            />
          )}
          {!nameError && name && (
            <img
              src={tick}
              alt='invalid'
              className='absolute top-1/2 -translate-y-1/2 right-2'
            />
          )}
        </div>
        {/* username */}
        <div className='relative bg-lotion w-full border border-gainsboro py-[0.4375rem] rounded-sm mb-1.5'>
          <label
            className={`${
              userName
                ? '-translate-y-[90%] text-[0.625rem]'
                : '-translate-y-1/2 text-xs'
            } absolute text-philippinegray left-2 top-1/2 pointer-events-none z-10 transition-all duration-75 ease-linear`}
          >
            Username
          </label>
          <input
            value={userName}
            onChange={e => setUserName(e.target.value)}
            onFocus={() => setUserNameError(false)}
            onBlur={checkUserNameError}
            className={`${
              userName && 'text-xs translate-y-1.5'
            } w-full bg-lotion outline-0 px-2  transition-all duration-75 ease-linear`}
          />
          {userNameError && (
            <img
              src={cross}
              alt='invalid'
              className='absolute top-1/2 -translate-y-1/2 right-2'
            />
          )}
          {!userNameError && userName.length > 0 && !userName.includes(' ') && (
            <img
              src={tick}
              alt='invalid'
              className='absolute top-1/2 -translate-y-1/2 right-2'
            />
          )}
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
            onFocus={() => setPasswordError(false)}
            onBlur={checkPasswordError}
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
          {passwordError && (
            <img
              src={cross}
              alt='invalid'
              className={`${
                password ? `right-12` : `right-2`
              } absolute top-1/2 -translate-y-1/2`}
            />
          )}
          {!passwordError && password.match(passwordRegex) && (
            <img
              src={tick}
              alt='invalid'
              className={`${
                password ? `right-12` : `right-2`
              } absolute top-1/2 -translate-y-1/2`}
            />
          )}
        </div>
        {/* terms */}
        <div className='text-philippinegray text-xs my-2.5'>
          <p className='mb-2.5'>
            People who use our service may have uploaded your contact
            information to Instagram.{' '}
            <span className='font-semibold'>Learn More</span>
          </p>
          <p>
            By signing up, you agree to our{' '}
            <span className='font-semibold'>Terms</span> ,
            <span className='font-semibold'>Data Policy</span> and{' '}
            <span className='font-semibold'>Cookies Policy</span> .{' '}
          </p>
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
          Sign up
        </button>
        {/* submit error */}
        {submitError && <p className='text-desire mt-2.5'>{submitError}</p>}
      </form>

      {/* login instead */}
      <div className='border-0 sm:border border-gainsboro bg-current sm:bg-white py-6 text-center flex items-center justify-center mt-2.5'>
        <p>Have an account?</p>
        <Link to='/login' className='text-vividcerulean ml-1'>
          Log in
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

export default Signup
