import { useEffect, useState } from 'react'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { auth, db } from '../../../config/firebase.config'

const ProfileEdit = () => {
  const [name, setName] = useState('')
  const [userName, setUserName] = useState('')
  const [bio, setBio] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false)
  const [photoUploadError, setPhotoUploadError] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(auth.currentUser.photoURL)

  const getProfile = async () => {
    const docRef = doc(db, 'users', auth.currentUser.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setName(docSnap.data().name)
      setUserName(docSnap.data().userName)
      setBio(docSnap.data().bio)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitLoading(true)
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name,
        userName,
        bio,
      })
      updateProfile(auth.currentUser, {
        displayName: userName,
      })
      setSubmitError(false)
      setSubmitSuccess(true)
    } catch (err) {
      setSubmitError(true)
      setSubmitSuccess(false)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleProfilePhotoUpload = async e => {
    setPhotoUploadLoading(true)
    if (
      e.target.files[0].type.includes('png') ||
      e.target.files[0].type.includes('jpeg')
    ) {
      try {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${
          e.target.files[0].name
        }-${uuidv4()}`
        const storageRef = ref(storage, 'profilePhotos/' + fileName)
        await uploadBytes(storageRef, e.target.files[0])
        const photoURL = await getDownloadURL(storageRef)
        updateProfile(auth.currentUser, { photoURL })
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          photoURL,
        })
        setProfilePhoto(photoURL)
      } catch (err) {
        setPhotoUploadError(err.message)
      }
    } else {
      setPhotoUploadError('Please upload a png or a jpeg file')
    }
    setPhotoUploadLoading(false)
    document.getElementById('profilePhoto').value = ''
  }

  return (
    <form onSubmit={e => handleSubmit(e)}>
      {/* edit photo */}
      <div className='flex items-center justify-center mb-4'>
        <div className='flex flex-1 justify-end'>
          <img
            src={profilePhoto}
            alt='avatar'
            loading='lazy'
            className='h-[2.625rem] w-[2.625rem] rounded-full object-cover'
          />
        </div>
        <div className='flex-[4] ml-8'>
          <h1 className='text-[1.25rem] mb-0.5'>
            {auth.currentUser.displayName}
          </h1>
          <label
            htmlFor='profilePhoto'
            className={`${
              photoUploadLoading
                ? 'text-freshair pointer-events-none'
                : 'text-vividcerulean cursor-pointer'
            } font-semibold `}
          >
            Change Profile Photo
          </label>
          <input
            type='file'
            id='profilePhoto'
            accept='image/gif, image/jpeg'
            className='hidden'
            onChange={e => handleProfilePhotoUpload(e)}
            disabled={photoUploadLoading}
          />
        </div>
      </div>
      {/* photo error */}
      {photoUploadError && (
        <div className='flex items-center justify-center mb-4'>
          <div className='flex flex-1 justify-end'></div>
          <div className='flex-[4] ml-8'>
            <p className='text-desire w-[70%]'>{photoUploadError}</p>
          </div>
        </div>
      )}
      {/* name */}
      <div className='flex items-center justify-center mb-4'>
        <div className='flex flex-1 justify-end'>
          <label htmlFor='name' className='font-semibold text-base'>
            Name
          </label>
        </div>
        <div className='flex-[4] ml-8'>
          <input
            id='name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='border border-gainsboro w-full sm:w-[75%] rounded px-2.5 py-[3px] text-base'
          />
        </div>
      </div>
      {/* username */}
      <div className='flex items-center justify-center mb-4'>
        <div className='flex flex-1 justify-end'>
          <label htmlFor='username' className='font-semibold text-base'>
            Username
          </label>
        </div>
        <div className='flex-[4] ml-6 sm:ml-8'>
          <input
            id='username'
            value={userName}
            onChange={e => setUserName(e.target.value)}
            className='border border-gainsboro w-full sm:w-[75%] rounded px-2.5 py-[3px] text-base'
          />
        </div>
      </div>
      {/* bio */}
      <div className='flex items-center justify-center mb-4'>
        <div className='flex flex-1 justify-end'>
          <label htmlFor='bio' className='font-semibold text-base'>
            Bio
          </label>
        </div>
        <div className='flex-[4] ml-8'>
          <textarea
            id='bio'
            value={bio}
            onChange={e => setBio(e.target.value)}
            className='border border-gainsboro w-full sm:w-[75%] rounded px-2.5 py-[3px] text-base'
          />
        </div>
      </div>
      {/* error */}
      {submitError && (
        <div className='flex items-center justify-center mb-4'>
          <div className='flex flex-1 justify-end'></div>
          <div className='flex-[4] ml-8'>
            <p className='text-desire w-[70%]'>
              Something went wrong while trying to save your information please
              try again
            </p>
          </div>
        </div>
      )}
      {/* success */}
      {submitSuccess && (
        <div className='flex items-center justify-center mb-4'>
          <div className='flex flex-1 justify-end'></div>
          <div className='flex-[4] ml-8'>
            <p className='w-[70%]'>Profile Saved</p>
          </div>
        </div>
      )}
      {/* submit */}
      <div className='flex items-center justify-center mb-4'>
        <div className='flex flex-1 justify-end'></div>
        <div className='flex-[4] ml-8'>
          <button
            className={`${
              submitLoading
                ? 'bg-freshair pointer-event-none'
                : 'bg-vividcerulean'
            } text-white font-semibold px-2 py-1 rounded`}
            disabled={submitLoading}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProfileEdit
