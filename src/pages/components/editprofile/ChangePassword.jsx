import { useEffect, useState, useMemo } from 'react'
import { updatePassword } from 'firebase/auth'
import { auth } from '../../../config/firebase.config'

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [sumbitDisabled, setSumbitDisabled] = useState(true)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const passwordRegex = useMemo(
    () => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/,
    []
  )

  useEffect(() => {
    if (
      newPassword &&
      confirmNewPassword &&
      newPassword === confirmNewPassword &&
      newPassword.match(passwordRegex)
    )
      setSumbitDisabled(false)
    else setSumbitDisabled(true)
  }, [newPassword, confirmNewPassword, passwordRegex])

  const handleSubmit = async e => {
    e.preventDefault()
    setSumbitDisabled(true)
    try {
      await updatePassword(auth.currentUser, newPassword)
      setSubmitError('')
      setSubmitSuccess(true)
    } catch (err) {
      setSubmitError(err?.code)
      setSubmitSuccess(false)
    } finally {
      setSumbitDisabled(false)
    }
  }

  return (
    <form onSubmit={e => handleSubmit(e)}>
      {/* photo */}
      <div className='flex items-center justify-center mb-4'>
        <div className='flex flex-1 justify-end'>
          <img
            src={auth.currentUser.photoURL}
            alt='avatar'
            loading='lazy'
            className='h-[2.625rem] w-[2.625rem] rounded-full object-cover'
          />
        </div>
        <div className='flex-[4] ml-8'>
          <h1 className='text-2xl mb-0.5'>{auth.currentUser.displayName}</h1>
        </div>
      </div>
      {/* new password */}
      <div className='flex items-center justify-center mb-4'>
        <div className='flex flex-1 justify-end'>
          <label htmlFor='newpassword' className='font-semibold text-base'>
            New Password
          </label>
        </div>
        <div className='flex-[4] ml-8'>
          <input
            id='newpassword'
            value={newPassword}
            type='password'
            onChange={e => setNewPassword(e.target.value)}
            className='border border-gainsboro w-full sm:w-[75%] rounded px-2.5 py-[3px] text-base'
          />
        </div>
      </div>
      {/* confirm new password */}
      <div className='flex items-center justify-center mb-4'>
        <div className='flex flex-1 text-left sm:text-right'>
          <label
            htmlFor='confirmnewpassword'
            className='font-semibold text-base'
          >
            Confirm New Password
          </label>
        </div>
        <div className='flex-[4] ml-8'>
          <input
            id='confirmnewpassword'
            value={confirmNewPassword}
            type='password'
            onChange={e => setConfirmNewPassword(e.target.value)}
            className='border border-gainsboro w-full sm:w-[75%] rounded px-2.5 py-[3px] text-base'
          />
        </div>
      </div>
      {/* error */}
      {submitError && (
        <div className='flex items-center justify-center mb-4'>
          <div className='flex flex-1 justify-end'></div>
          <div className='flex-[4] ml-8'>
            <p className='text-desire w-[70%]'>{submitError}</p>
          </div>
        </div>
      )}
      {/* success */}
      {submitSuccess && (
        <div className='flex items-center justify-center mb-4'>
          <div className='flex flex-1 justify-end'></div>
          <div className='flex-[4] ml-8'>
            <p className='w-[70%]'>Password Changed</p>
          </div>
        </div>
      )}
      {/* submit */}
      <div className='flex items-center justify-center mb-10'>
        <div className='flex flex-1 justify-end text-right'></div>
        <div className='flex-[4] ml-8'>
          <button
            className={`${
              sumbitDisabled
                ? 'bg-freshair pointer-event-none'
                : 'bg-vividcerulean'
            } text-white font-semibold px-2 py-1 rounded`}
            disabled={sumbitDisabled}
          >
            Change Password
          </button>
        </div>
      </div>
    </form>
  )
}

export default ChangePassword
