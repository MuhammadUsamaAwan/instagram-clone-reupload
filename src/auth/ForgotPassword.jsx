import { useState, useMemo, useEffect } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../config/firebase.config'
import lock from '../assets/images/lock.png'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  // states
  const [email, setEmail] = useState('')
  const [allowSubmit, setAllowSubmit] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState('')

  // regex
  const emailRegex = useMemo(() => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, [])

  // check if submit allowed
  useEffect(() => {
    if (email.match(emailRegex)) setAllowSubmit(true)
    else setAllowSubmit(false)
  }, [email, emailRegex])

  // submit function
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await sendPasswordResetEmail(auth, email)
      setSubmitSuccess('Password Reset Link Sent.')
    } catch (err) {
      setSubmitSuccess('Password Reset Link Sent.')
    }
  }

  return (
    <div className='max-w-[21.875rem]'>
      {/* signup form */}
      <form
        className='border-0 sm:border border-gainsboro bg-current sm:bg-white p-10 pt-6 text-center flex flex-col items-center justify-center'
        onSubmit={e => handleSubmit(e)}
      >
        {/* lock */}
        <img src={lock} alt='forgotpassword' />
        {/* heading */}
        <h2 className='font-semibold text-base my-2.5'>Trouble Logging In?</h2>
        {/* Sub heading */}
        <p className='text-philippinegray'>
          Enter your email, phone, or username and we'll send you a link to get
          back into your account.
        </p>
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
            Email, Phone, or Username
          </label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`${
              email && 'text-xs translate-y-1.5'
            } w-full bg-lotion outline-0 px-2  transition-all duration-75 ease-linear`}
          />
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
          Send Login Link
        </button>
        {/* submit success */}
        {submitSuccess && <p className='my-1.5'>{submitSuccess}</p>}
        {/* or */}
        <div className='grid grid-cols-[6.8125rem_auto_6.8125rem] items-center my-2.5'>
          <div className='bg-gainsboro h-[1px]'></div>
          <div className='text-[0.8125rem] font-semibold text-philippinegray mx-4'>
            OR
          </div>
          <div className='bg-gainsboro h-[1px]'></div>
        </div>
        {/* login with facebook */}
        <Link to='/signup' className='text-metallicblue font-semibold ml-1'>
          Create a New Account
        </Link>
      </form>

      {/* back to login */}
      <div className='border-0 sm:border-b sm:border-r sm:border-l border-collapse border-gainsboro bg-lotion py-2.5 text-center flex items-center justify-center'>
        <Link to='/login' className='text-metallicblue font-semibold'>
          Back To Login
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
