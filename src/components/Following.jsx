import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import { db } from '../config/firebase.config'
import { collection, getDocs, query, where } from 'firebase/firestore'

const Following = ({ openFollowingModal, setOpenFollowingModal, userId }) => {
  const [following, setFollowing] = useState([])

  Modal.setAppElement(document.getElementById('root'))

  const getFollowing = async () => {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('followers', 'array-contains', userId))
    const querySnap = await getDocs(q)
    const users = []
    querySnap.forEach(doc => {
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    setFollowing(users)
  }
  useEffect(() => {
    getFollowing()
  }, [userId])
  return (
    <Modal
      isOpen={openFollowingModal}
      closeTimeoutMS={100}
      onRequestClose={() => setOpenFollowingModal(false)}
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
          Following
        </div>
        <div className='space-y-2 my-2 px-4'>
          {following?.map(following => (
            <Link
              to={`/users/${following?.id}`}
              key={following?.id}
              className='flex items-center space-x-4'
            >
              <img
                src={following?.data?.photoURL}
                alt='avatar'
                className='h-[1.875rem] w-[1.875rem] rounded-full object-cover'
              />
              <div>{following?.data?.userName}</div>
            </Link>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default Following
