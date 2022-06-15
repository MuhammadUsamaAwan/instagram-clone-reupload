import { useEffect, useState } from 'react'
import { auth, db } from '../config/firebase.config'
import {
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  addDoc,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore'
import moment from 'moment'

const DM = () => {
  const [following, setFollowing] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState('')
  const [collectionName, setCollectionName] = useState(null)
  const [messageSubmitLoading, setMessageSubmitLoading] = useState(false)
  const [messages, setMessages] = useState([])

  const getFollowing = async () => {
    const usersRef = collection(db, 'users')
    const q = query(
      usersRef,
      where('followers', 'array-contains', auth.currentUser.uid)
    )
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
    if (collectionName)
      db.collection(collectionName).onSnapshot(snapshot =>
        console.log(snapshot.docs.map(doc => doc.data()))
      )
  }, [])

  useEffect(() => {
    console.log(collectionName)
    if (collectionName) {
      const q = query(
        collection(db, collectionName),
        orderBy('timestamp'),
        limit(25)
      )
      onSnapshot(q, querySnapshot => {
        const messages = []
        querySnapshot.forEach(doc => {
          messages.push(doc.data())
        })
        setMessages(messages)
      })
    }
  }, [onSnapshot, collectionName])

  const postChat = async e => {
    e.preventDefault()
    setMessageSubmitLoading(true)
    await addDoc(collection(db, collectionName), {
      message,
      uid: selectedUser.id,
      timestamp: serverTimestamp(),
    })
    setMessage('')
    setMessageSubmitLoading(false)
  }

  return (
    <section className='grid place-content-center'>
      <div className='flex border border-gainsboro rounded-md bg-white w-screen lg:w-[58.4375rem] mt-0 lg:mt-4 h-[calc(100vh-3.75rem)] lg:h-[calc(100vh-4.75rem)]'>
        {/* left content */}
        <div className='w-[38%] border-r border-gainsboro overflow-scroll scroll-hidden'>
          {/* current user */}
          <div className='text-base font-semibold text-center border-b border-gainsboro py-[1.1rem]'>
            {auth.currentUser.displayName}
          </div>
          {/* users */}
          <div className='mt-1.5 space-y-0.5'>
            {/* user */}
            {following.map(user => (
              <button
                key={user?.id}
                className={`${
                  user === selectedUser ? 'bg-brightgray' : 'hover:bg-lotion'
                } w-full flex items-center space-x-2 px-5 py-2`}
                onClick={() => {
                  setSelectedUser(user)
                  setCollectionName(
                    [user.id, auth.currentUser.uid].sort().join('')
                  )
                }}
              >
                <img
                  src={user?.data?.photoURL}
                  alt='avatar'
                  className='h-[3.5rem] w-[3.5rem] object-cover rounded-full'
                />
                <div>{user?.data?.userName}</div>
              </button>
            ))}
          </div>
        </div>
        {/* right content */}
        <div className='w-[62%] flex flex-col'>
          {/* chat user header */}
          {selectedUser && (
            <>
              <div className='flex items-center px-8 py-[1.1rem] border-b border-gainsboro space-x-4'>
                <img
                  src={selectedUser?.data?.photoURL}
                  alt='avatar'
                  className='h-[1.5rem] w-[1.5rem] object-cover rounded-full'
                />
                <div className='text-base font-semibold text-center'>
                  {selectedUser?.data?.userName}
                </div>
              </div>
              {/* chat */}
              <div className='overflow-y-scroll scroll-hidden p-4 space-y-2 flex-1'>
                {messages.map(msg =>
                  msg.uid === auth.currentUser.uid ? (
                    <div
                      className='flex space-x-2 items-center'
                      key={msg.timestamp}
                    >
                      <img
                        src={selectedUser?.data?.photoURL}
                        alt='avatar'
                        className='h-[1.5rem] w-[1.5rem] object-cover rounded-full'
                      />
                      <div>
                        <div className='border border-gainsboro rounded-[1.375rem] px-4 py-2'>
                          {msg?.message}
                        </div>
                        <div className='text-[0.625rem] text-philippinegray ml-2'>
                          {moment(msg?.timestamp?.toDate()).fromNow()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className='flex space-x-2 items-end justify-end flex-col'
                      key={msg.timestamp}
                    >
                      <div className='border border-gainsboro rounded-[1.375rem] px-4 py-2'>
                        {msg?.message}
                      </div>
                      <div className='text-[0.625rem] text-philippinegray'>
                        {moment(msg?.timestamp?.toDate()).fromNow()}
                      </div>
                    </div>
                  )
                )}
              </div>
              {/* new message */}
              <form
                className='m-5 px-4 border border-gainsboro rounded-full flex items-center'
                onSubmit={e => postChat(e)}
              >
                <input
                  className='py-2 outline-0 flex-1'
                  placeholder='Message...'
                  maxLength={50}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <button
                  className={`${
                    message && !messageSubmitLoading
                      ? 'text-vividcerulean'
                      : 'text-freshair'
                  } font-semibold`}
                  disabled={!message || messageSubmitLoading}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default DM
