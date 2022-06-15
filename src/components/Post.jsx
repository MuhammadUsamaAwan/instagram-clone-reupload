import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as Like } from '../assets/icons/notliked.svg'
import { ReactComponent as Unlike } from '../assets/icons/liked.svg'
import { ReactComponent as Comment } from '../assets/icons/commentpost.svg'
import { ReactComponent as Share } from '../assets/icons/share.svg'
import { ReactComponent as Saved } from '../assets/icons/savedpost.svg'
import { ReactComponent as Dots } from '../assets/icons/dots.svg'
import {
  getDoc,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { auth, db } from '../config/firebase.config'
import moment from 'moment'
import Comments from './Comments'
import Likes from './Likes'
import PostActions from './PostActions'

const Post = ({ openPostModal, setOpenPostModal, postId }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [postData, setPostData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [submitLikeLoading, setSubmitLikeLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [submitCommentLoading, setSubmitCommentLoading] = useState(false)
  const [submitCommentDisabled, setSubmitCommentDisabled] = useState(true)
  const [openLikesModal, setOpenLikesModal] = useState(false)
  const [openActionsModal, setOpenActionsModal] = useState(false)

  const getPost = async () => {
    let docRef = doc(db, 'posts', postId)
    let docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setPostData(docSnap.data())
      docRef = doc(db, 'users', docSnap.data().userRef)
      docSnap = await getDoc(docRef)
      if (docSnap.exists()) setUserData(docSnap.data())
    }
    setLoading(false)
  }

  Modal.setAppElement(document.getElementById('root'))

  const handleLike = async () => {
    setSubmitLikeLoading(true)
    await updateDoc(doc(db, 'posts', postId), {
      likes: arrayUnion(auth.currentUser.uid),
    })
    setSubmitLikeLoading(false)
    getPost()
  }

  const handleUnlike = async () => {
    setSubmitLikeLoading(true)
    await updateDoc(doc(db, 'posts', postId), {
      likes: arrayRemove(auth.currentUser.uid),
    })
    setSubmitLikeLoading(false)
    getPost()
  }

  const handleComment = async e => {
    e.preventDefault()
    setSubmitCommentLoading(true)
    await updateDoc(doc(db, 'posts', postId), {
      comments: arrayUnion({
        comment,
        userRef: auth.currentUser.uid,
      }),
    })
    setComment('')
    setSubmitCommentLoading(false)
    getPost()
  }

  useEffect(() => {
    if (openPostModal) getPost()
    return () => setPostData()
  }, [openPostModal])

  useEffect(() => {
    if (comment) setSubmitCommentDisabled(false)
    else setSubmitCommentDisabled(true)
  }, [comment])

  if (loading) return <></>
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
      <div className='w-[75vw] h-[50vh] sm:h-[94vh] bg-white flex'>
        {/* image */}
        <img
          src={postData?.image}
          alt='post'
          className='h-full w-1/2 sm:w-[65%] object-cover'
        />
        {/* post info */}
        <div className='w-1/2 sm:w-[35%] flex flex-col'>
          {/* user info */}
          <div className='flex items-center justify-between space-x-3 mb-2 px-4 pt-3.5'>
            <div
              className='flex items-center space-x-3 cursor-pointer'
              onClick={() => {
                setOpenPostModal(false)
                navigate(`/users/${postData?.userRef}`)
              }}
            >
              <img
                src={userData?.photoURL}
                alt='profile'
                className='w-8 h-8 object-cover rounded-full'
              />
              <div className='font-semibold'>{userData?.userName}</div>
            </div>
            {postData?.userRef === auth.currentUser.uid && (
              <button>
                <Dots onClick={() => setOpenActionsModal(true)} />
              </button>
            )}
          </div>
          <p className='px-4 border-b border-gainsboro pb-3.5'>
            {postData?.caption}
          </p>
          {/* actions modal */}
          <PostActions
            openActionsModal={openActionsModal}
            setOpenActionsModal={setOpenActionsModal}
            setOpenPostModal={setOpenPostModal}
            postId={postId}
          />
          {/* comments */}
          <Comments
            comments={postData?.comments}
            setOpenPostModal={setOpenPostModal}
            postId={postId}
          />
          {/* actions */}
          <div className='px-4 flex items-center justify-between py-3.5 border-t border-gainsboro'>
            <div className='flex items-center space-x-4'>
              <button disabled={submitLikeLoading} className='cursor-pointer'>
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
          <div className='font-semibold px-4'>
            <button onClick={() => setOpenLikesModal(true)}>
              {postData?.likes ? postData?.likes.length : 0} likes
            </button>
          </div>
          {/* likes modal */}
          <Likes
            openLikesModal={openLikesModal}
            setOpenLikesModal={setOpenLikesModal}
            userIds={postData?.likes ? postData?.likes : []}
          />
          {/* time */}
          <div className='px-4 uppercase text-[0.625rem] text-philippinegray pb-3.5 border-b border-gainsboro'>
            {moment(postData?.timestamp?.toDate()).fromNow()}
          </div>
          {/* new comment */}
          <form className='flex px-4' onSubmit={e => handleComment(e)}>
            <input
              id='comment'
              placeholder='Add a comment...'
              className='flex-1 py-3.5 outline-0'
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength='30'
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
      </div>
    </Modal>
  )
}

export default Post
