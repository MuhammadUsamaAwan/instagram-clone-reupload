import { useEffect, useState } from 'react'
import { getDoc, updateDoc, doc, arrayRemove } from 'firebase/firestore'
import { auth, db } from '../config/firebase.config'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'
import { ReactComponent as Dots } from '../assets/icons/dots.svg'

const CommentsSection = ({ comments, setOpenPostModal, postId }) => {
  const navigate = useNavigate()
  const [commentsData, setCommentsData] = useState([])
  const [selectedComment, setSelectedComment] = useState({})
  const [openCommentActionsModal, setOpenCommentActionsModal] = useState(false)

  Modal.setAppElement(document.getElementById('root'))

  const getComments = async () => {
    if (comments) {
      comments.forEach(async comment => {
        const docRef = doc(db, 'users', comment.userRef)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists())
          setCommentsData(commentsData => [
            ...commentsData,
            {
              comment: comment.comment,
              userRef: comment.userRef,
              userName: docSnap.data().userName,
              photoURL: docSnap.data().photoURL,
            },
          ])
      })
    }
  }

  const deleteComment = async () => {
    await updateDoc(doc(db, 'posts', postId), {
      comments: arrayRemove({
        comment: selectedComment.comment,
        userRef: auth.currentUser.uid,
      }),
    })
    setOpenCommentActionsModal(false)
    setCommentsData(
      comments.filter(
        comment =>
          comment.comment !== selectedComment.comment ||
          comment.userRef !== selectedComment.userRef
      )
    )
  }

  useEffect(() => {
    setCommentsData([])
    getComments()
  }, [comments])

  return (
    <>
      {commentsData.length !== 0 ? (
        <div className='flex-1 px-4 py-3.5 overflow-scroll scroll-hidden'>
          {commentsData.map(comment => (
            <div
              key={`${comment?.comment}${comment?.userRef}`}
              className='mb-4 flex justify-between'
            >
              <div
                className='flex space-x-3 cursor-pointer'
                onClick={() => {
                  setOpenPostModal(false)
                  navigate(`/users/${comment.userRef}`)
                }}
              >
                <img
                  src={comment?.photoURL}
                  alt='profile'
                  className='w-8 h-8 rounded-full object-cover'
                />
                <div className='font-semibold'>
                  {comment?.userName}
                  <span className='ml-1 font-normal'>{comment?.comment}</span>
                </div>
              </div>
              {comment.userRef === auth.currentUser.uid && (
                <button
                  onClick={() => {
                    setSelectedComment(comment)
                    setOpenCommentActionsModal(true)
                  }}
                >
                  <Dots />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='flex-1 px-4 py-3.5'>No comments yet...</div>
      )}
      {/* deleteComment Modal */}
      <Modal
        isOpen={openCommentActionsModal}
        closeTimeoutMS={100}
        onRequestClose={() => setOpenCommentActionsModal(false)}
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
        <div className='flex flex-col text-center w-[25rem]'>
          <button
            className='w-full p-3.5 border-b border-gainsboro text-desire font-semibold'
            onClick={deleteComment}
          >
            Delete Comment
          </button>
          <button
            className='w-full p-3.5 border-gainsboro'
            onClick={() => setOpenCommentActionsModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  )
}

export default CommentsSection
