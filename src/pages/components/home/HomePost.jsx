import { useEffect, useState } from 'react'
import {
  getDoc,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { auth, db } from '../../../config/firebase.config'
import { Link } from 'react-router-dom'
import { useEventListener } from '../../../hooks/useEventListener'
import { ReactComponent as Like } from '../../../assets/icons/notliked.svg'
import { ReactComponent as Unlike } from '../../../assets/icons/liked.svg'
import { ReactComponent as Comment } from '../../../assets/icons/commentpost.svg'
import { ReactComponent as Share } from '../../../assets/icons/share.svg'
import { ReactComponent as Saved } from '../../../assets/icons/savedpost.svg'
import moment from 'moment'
import Post from '../../../components/Post'
import Likes from '../../../components/Likes'

const HomePost = ({ id, postData }) => {
  const [userData, setUserData] = useState({})
  const [userDataLoading, setUserDataLoading] = useState(true)
  const [submitLikeLoading, setSubmitLikeLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [submitCommentLoading, setSubmitCommentLoading] = useState(false)
  const [submitCommentDisabled, setSubmitCommentDisabled] = useState(true)
  const [openPostModal, setOpenPostModal] = useState(false)
  const [openLikesModal, setOpenLikesModal] = useState(false)

  const getUserData = async () => {
    const docRef = doc(db, 'users', postData.userRef)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) setUserData(docSnap.data())
    setUserDataLoading(false)
  }

  const handleLike = async () => {
    setSubmitLikeLoading(true)
    await updateDoc(doc(db, 'posts', id), {
      likes: arrayUnion(auth.currentUser.uid),
    })
    setSubmitLikeLoading(false)
  }

  const handleUnlike = async () => {
    setSubmitLikeLoading(true)
    await updateDoc(doc(db, 'posts', id), {
      likes: arrayRemove(auth.currentUser.uid),
    })
    setSubmitLikeLoading(false)
  }

  const handleComment = async e => {
    e.preventDefault()
    setSubmitCommentLoading(true)
    await updateDoc(doc(db, 'posts', id), {
      comments: arrayUnion({
        comment,
        userRef: auth.currentUser.uid,
      }),
    })
    setComment('')
    setSubmitCommentLoading(false)
  }

  useEventListener(
    'dblclick',
    () => {
      handleLike()
    },
    document.getElementById(id)
  )

  useEffect(() => {
    getUserData()
  }, [])

  useEffect(() => {
    if (comment) setSubmitCommentDisabled(false)
    else setSubmitCommentDisabled(true)
  }, [comment])

  if (userDataLoading) return <></>

  return (
    <div className='w-full sm:w-[29.375rem]' id={id}>
      {/* user info */}
      <Link
        to={`/users/${postData?.userRef}`}
        className='flex items-center space-x-2 border-t border-l border-r border-gainsboro p-2 rounded-tr-md rounded-tl-md'
      >
        <img
          src={userData?.photoURL}
          alt='avatar'
          className='h-8 w-8 object-cover rounded-full mb-1'
        />
        <h1 className='font-semibold'>{userData?.userName}</h1>
      </Link>
      {/* post img */}
      <img
        id={id}
        src={postData?.image}
        alt='post'
        className='h-[29.375rem] w-full sm:w-[29.375rem] object-cover cursor-pointer'
        loading='lazy'
      />
      {/* post info */}
      <div className='border-b border-l border-r border-gainsboro rounded-br-md rounded-bl-md'>
        {/* actions */}
        <div className='flex items-center justify-between pt-2.5 px-2.5'>
          <div className='flex items-center space-x-4'>
            <button className='cursor-pointer' disabled={submitLikeLoading}>
              {postData?.likes.includes(auth.currentUser.uid) ? (
                <Unlike onClick={handleUnlike} />
              ) : (
                <Like onClick={handleLike} />
              )}
            </button>
            <label htmlFor='comment' className='cursor-pointer'>
              <Comment />
            </label>
            <Share />
          </div>
          <Saved />
        </div>
        {/* likes */}
        <button
          className='font-semibold py-2.5 px-2.5'
          onClick={() => setOpenLikesModal(true)}
          disabled={postData?.likes.length === 0}
        >
          {postData?.likes ? postData?.likes.length : 0} likes
        </button>
        {/* likes modal */}
        <Likes
          openLikesModal={openLikesModal}
          setOpenLikesModal={setOpenLikesModal}
          userIds={postData?.likes ? postData?.likes : []}
        />
        {/* caption */}
        <p className='px-2.5'>
          <span className='mr-1 font-semibold'>{postData?.displayName}</span>
          {postData?.caption}
        </p>
        {/* view comment */}
        <button
          className='text-philippinegray py-2.5 px-2.5'
          onClick={() => setOpenPostModal(true)}
        >
          View Comments
        </button>
        {/* time */}
        <div className='uppercase text-[0.625rem] text-philippinegray pb-2.5 px-2.5'>
          {moment(postData?.timestamp?.toDate()).fromNow()}
        </div>
        {/* New Comment */}
        <form
          className='flex px-2.5 border-t border-gainsboro'
          onSubmit={e => handleComment(e)}
        >
          <input
            id='comment'
            placeholder='Add a comment...'
            className='flex-1 py-3.5 outline-0 bg-transparent'
            value={comment}
            onChange={e => setComment(e.target.value)}
            maxLength='20'
          />
          <button
            className={`${
              submitCommentLoading || submitCommentDisabled
                ? 'text-freshair'
                : 'text-vividcerulean'
            } font-semibold`}
            disabled={submitCommentLoading || submitCommentDisabled}
          >
            Post
          </button>
        </form>
      </div>
      <Post
        openPostModal={openPostModal}
        setOpenPostModal={setOpenPostModal}
        postId={id}
        userData={userData}
      />
    </div>
  )
}

export default HomePost
