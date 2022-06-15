import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase.config'

const Likes = ({ openLikesModal, setOpenLikesModal, userIds }) => {
  const [likes, setLikes] = useState([])
  let isMounted = false

  Modal.setAppElement(document.getElementById('root'))

  const getLikes = async () => {
    userIds.forEach(async user => {
      const docRef = doc(db, 'users', user)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists())
        setLikes(likes => [
          ...likes,
          {
            userRef: user,
            userName: docSnap.data().userName,
            photoURL: docSnap.data().photoURL,
          },
        ])
    })
    isMounted = true
  }

  useEffect(() => {
    if (!isMounted) getLikes()
  }, [])

  return (
    <Modal
      isOpen={openLikesModal}
      closeTimeoutMS={100}
      onRequestClose={() => setOpenLikesModal(false)}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
        },
        content: {
          border: 0,
          borderRadius: '0 4px 4px 0',
          width: 'fit-content',
          height: 'fit-content',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: 0,
        },
      }}
    >
      <div className='w-[16.25rem] max-h-[25rem] sm:w-[25rem] overflow-y-scroll scroll-hidden'>
        <div className='text-center text-base font-semibold py-2 border-b border-gainsboro'>
          Likes
        </div>
        <div className='space-y-2 my-2 px-4'>
          {likes?.map(like => (
            <Link
              to={`/users/${like?.userRef}`}
              key={like?.userRef}
              className='flex items-center space-x-4'
            >
              <img
                src={like?.photoURL}
                alt='avatar'
                className='h-[1.875rem] w-[1.875rem] rounded-full object-cover'
              />
              <div>{like?.userName}</div>
            </Link>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default Likes
