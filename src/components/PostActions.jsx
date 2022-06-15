import Modal from 'react-modal'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase.config'

const PostActions = ({
  openActionsModal,
  setOpenActionsModal,
  setOpenPostModal,
  postId,
}) => {
  Modal.setAppElement(document.getElementById('root'))
  const deletePost = async () => {
    await deleteDoc(doc(db, 'posts', postId))
    setOpenActionsModal(false)
    setOpenPostModal(false)
  }
  return (
    <Modal
      isOpen={openActionsModal}
      closeTimeoutMS={100}
      onRequestClose={() => setOpenActionsModal(false)}
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
          onClick={deletePost}
        >
          Delete Post
        </button>
        <button
          className='w-full p-3.5 border-gainsboro'
          onClick={() => setOpenActionsModal(false)}
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default PostActions
