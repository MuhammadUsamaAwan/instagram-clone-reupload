import React, { useState } from 'react'
import Modal from 'react-modal'
import { serverTimestamp, addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { auth, db } from '..//config/firebase.config'
import { ReactComponent as NewPostIcon } from '../assets/icons/newpost.svg'
import { ReactComponent as ErrorIcon } from '../assets/icons/error.svg'
import { ReactComponent as LeftArrow } from '../assets/icons/left-arrow.svg'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'

const NewPost = ({ openPostModal, setOpenPostModal }) => {
  const navigate = useNavigate()
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [caption, setCaption] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  Modal.setAppElement(document.getElementById('root'))

  const onDrop = (acceptedFiles, fileRejections) => {
    if (acceptedFiles.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(acceptedFiles[0])
      reader.onload = function () {
        setImage({ data: reader.result, name: acceptedFiles[0].name })
        setError('')
      }
    }
    if (fileRejections.length > 0) {
      setError(fileRejections[0].errors[0].message)
      setImage(null)
    }
  }

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    minSize: 1 * 1024,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
  })

  const handlePost = async () => {
    setSubmitLoading(true)
    try {
      const storage = getStorage()
      const fileName = `${auth.currentUser.uid}-${
        acceptedFiles[0].name
      }-${uuidv4()}`
      const storageRef = ref(storage, 'posts/' + fileName)
      await uploadBytes(storageRef, acceptedFiles[0])
      const photoURL = await getDownloadURL(storageRef)
      await addDoc(collection(db, 'posts'), {
        image: photoURL,
        caption,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
        likes: [],
        comments: [],
      })
      setOpenPostModal(false)
      navigate('/userprofile?posts#postadded')
    } catch (err) {
      console.error(err.message)
    }
    setSubmitLoading(false)
  }

  return (
    <Modal
      isOpen={openPostModal}
      closeTimeoutMS={100}
      onRequestClose={() => setOpenPostModal(false)}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
        },
        content: {
          border: 0,
          borderRadius: '0.75rem',
          width: 'fit-content',
          height: 'fit-content',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: 0,
        },
      }}
    >
      <div className='w-[21.75rem] xl:w-[45rem] h-[59vh] sm:h-[81vh] flex flex-col'>
        {/* header */}
        <div className='text-base text-center bg-lotion p-2.5 font-semibold border-b border-gainsboro'>
          {error && "File couldn't be uploaded"}
          {!image && !error && 'Create new post'}
          {image && (
            <div className='flex items-center justify-between px-1'>
              <LeftArrow
                onClick={() => {
                  setImage(null)
                  setCaption('')
                }}
                className='cursor-pointer'
              />
              <div>Post</div>
              <button
                className={`${
                  submitLoading
                    ? 'text-freshair pointer-events-none'
                    : 'text-vividcerulean'
                } text-sm font-semibold`}
                onClick={handlePost}
                disabled={submitLoading}
              >
                Post
              </button>
            </div>
          )}
        </div>
        {/* content */}
        <div
          className='flex-1 grid content-center place-items-center relative'
          {...getRootProps()}
        >
          {!image && !error && (
            <>
              <NewPostIcon className='mb-4' />
              <h2 className='text-[1.375rem] font-light mb-6'>
                Drag photos and videos here
              </h2>
            </>
          )}
          {error && (
            <>
              <ErrorIcon className='mb-4' />
              <h2 className='text-[1.375rem] font-light mb-6'>{error}</h2>
            </>
          )}
          {image && (
            <div>
              <div className='absolute top-4 left-0 px-4 w-full'>
                <div className='flex items-center space-x-3 mb-2'>
                  <img
                    src={auth.currentUser.photoURL}
                    alt='profile'
                    className='w-[1.75rem] h-[1.75rem] rounded-full object-cover'
                  />
                  <div className='text-base font-semibold'>
                    {auth.currentUser.displayName}
                  </div>
                </div>
                <textarea
                  className='w-full text-base outline-0 resize-none top-2 left-0 border-b border-gainsboro'
                  maxLength='50'
                  placeholder='Write a caption...'
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                />
              </div>
              <img src={image?.data} />
            </div>
          )}
          <input type='file' {...getInputProps()} />
          {!image && !error && (
            <p
              className='bg-vividcerulean text-white font-semibold py-[0.3125rem] px-[0.5625rem] rounded cursor-pointer'
              onClick={open}
            >
              Select from computer
            </p>
          )}
          {error && (
            <p
              className='bg-vividcerulean text-white font-semibold py-[0.3125rem] px-[0.5625rem] rounded cursor-pointer'
              onClick={open}
            >
              Select other files
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default NewPost
