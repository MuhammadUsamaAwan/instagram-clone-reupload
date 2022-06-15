import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  collection,
  getDoc,
  doc,
  query,
  where,
  arrayRemove,
  arrayUnion,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { auth, db } from '../config/firebase.config'
import { ReactComponent as PostsIcon } from '../assets/icons/posts-profile.svg'
import { ReactComponent as PostsActiveIcon } from '../assets/icons/posts-profile-active.svg'
import { ReactComponent as VideosIcon } from '../assets/icons/videos.svg'
import { ReactComponent as VideosActiveIcon } from '../assets/icons/videos-active.svg'
import { ReactComponent as TaggedIcon } from '../assets/icons/tagged.svg'
import { ReactComponent as TaggedActiveIcon } from '../assets/icons/tagged-active.svg'
import { ReactComponent as FollowingIcon } from '../assets/icons/following.svg'
import PublicFooter from '../layouts/PublicFooter'
import UsersPost from './components/users/UsersPost'
import UsersVideos from './components/users/UsersVideos'
import UsersTagged from './components/users/UsersTagged'
import Modal from 'react-modal'
import Followers from '../components/Followers'
import Following from '../components/Following'

const UserProfile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [user, setUser] = useState({})
  const [activeTab, setActiveTab] = useState('')
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)
  const [openFollowersModal, setOpenFollowersModal] = useState(false)
  const [openFollowingModal, setOpenFollowingModal] = useState(false)

  const getProfile = async () => {
    onSnapshot(doc(db, 'users', params.id), doc => {
      setUser(doc.data())
    })
  }

  const getPosts = async () => {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, where('userRef', '==', params.id))
    onSnapshot(q, querySnapshot => {
      const posts = []
      querySnapshot.forEach(doc => {
        posts.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setPosts(posts)
    })
    setPostsLoading(false)
  }

  const handleUnfollow = async () => {
    setOpenUnfollowModal(false)
    await updateDoc(doc(db, 'users', params.id), {
      followers: arrayRemove(auth.currentUser.uid),
    })
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      following: arrayRemove(params.id),
    })
  }

  const handleFollow = async () => {
    await updateDoc(doc(db, 'users', params.id), {
      followers: arrayUnion(auth.currentUser.uid),
    })
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      following: arrayUnion(params.id),
    })
  }

  useEffect(() => {
    getProfile()
    getPosts()
  }, [onSnapshot, params])

  useEffect(() => {
    setActiveTab(location.search.slice(1) ? location.search.slice(1) : 'posts')
  }, [location])

  Modal.setAppElement(document.getElementById('root'))

  return (
    <section className='grid place-content-center'>
      <div className='py-[1.875rem] px-0 sm:px-5 w-screen md:w-[48rem] xl:w-[60.9375rem] min-h-[82vh]'>
        {/* profile header */}
        <div className='flex items-center'>
          <div className='flex-1'>
            <img
              src={user.photoURL}
              alt='avatar'
              loading='lazy'
              className='h-[4.6875rem] sm:h-[9.375rem] w-[4.6875rem] sm:w-[9.375rem] rounded-full object-cover ml-0 sm:ml-14'
            />
          </div>

          <div className='flex-[2] space-y-4'>
            <div>
              <div className='flex items-center space-x-6'>
                <h2 className='text-[1.75rem] font-light'>{user.userName}</h2>
                {params.id !== auth.currentUser.uid && (
                  <>
                    {user?.followers?.includes(auth.currentUser.uid) ? (
                      <div className='flex space-x-1'>
                        <button
                          className='font-semibold rounded border border-gainsboro py-[0.3125rem] px-[0.5625rem]'
                          onClick={() => navigate('/dm')}
                        >
                          Message
                        </button>
                        <button
                          className='border border-gainsboro py-[0.3125rem] px-[0.5625rem] rounded'
                          onClick={() => setOpenUnfollowModal(true)}
                        >
                          <FollowingIcon />
                        </button>
                        <Modal
                          isOpen={openUnfollowModal}
                          closeTimeoutMS={100}
                          onRequestClose={() => setOpenUnfollowModal(false)}
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
                          <div className='flex flex-col text-center items-center w-[25rem]'>
                            <img
                              src={user.photoURL}
                              className='w-[5.625rem] h-[5.625rem] rounded-full object-cover m-8'
                              alt='avatar'
                            />
                            <div className='mb-8'>
                              Unfollow @{user?.userName}?
                            </div>
                            <button
                              className='font-semibold text-desire p-3.5 border-t border-gainsboro w-full'
                              onClick={handleUnfollow}
                            >
                              Unfollow
                            </button>
                            <button
                              className='p-3.5 border-t border-gainsboro w-full'
                              onClick={() => setOpenUnfollowModal(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </Modal>
                      </div>
                    ) : (
                      <button
                        className='font-semibold rounded bg-vividcerulean text-white py-[0.3125rem] px-[0.5625rem]'
                        onClick={handleFollow}
                      >
                        Follow
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className='flex space-x-6 text-base'>
              <div>
                <span className='font-semibold mr-1'>
                  {posts ? posts?.length : 0}
                </span>
                posts
              </div>
              <button
                onClick={() => setOpenFollowersModal(true)}
                disabled={!user?.followers}
              >
                <span className='font-semibold mr-1'>
                  {user?.followers ? user?.followers.length : 0}
                </span>
                followers
              </button>
              <button
                onClick={() => setOpenFollowingModal(true)}
                disabled={!user?.following}
              >
                <span className='font-semibold mr-1'>
                  {user?.following ? user?.following.length : 0}
                </span>
                following
              </button>
            </div>

            {/* modals */}
            <Followers
              openFollowersModal={openFollowersModal}
              setOpenFollowersModal={setOpenFollowersModal}
              userId={params.id}
            />
            <Following
              openFollowingModal={openFollowingModal}
              setOpenFollowingModal={setOpenFollowingModal}
              userId={params.id}
            />

            <div className='text-base'>
              <div className='font-semibold'>{user.name}</div>
              {user.bio && <div>{user.bio}</div>}
            </div>
          </div>
        </div>
        {/* tabs */}
        <div className='border-t border-gainsboro mt-8 flex justify-center items-center space-x-20'>
          {/* post tab */}
          <button
            className={`${
              activeTab === 'posts' && 'border-t'
            } text-xs flex items-center py-6`}
            onClick={() => {
              setActiveTab('posts')
              navigate(`/users/${params.id}?posts`)
            }}
          >
            {activeTab === 'posts' ? <PostsActiveIcon /> : <PostsIcon />}
            <span
              className={`${
                activeTab !== 'posts' && 'text-philippinegray'
              } uppercase ml-1 font-semibold tracking-tighter-[1px]`}
            >
              posts
            </span>
          </button>
          {/* videos tab */}
          <button
            className={`${
              activeTab === 'videos' && 'border-t'
            } text-xs flex items-center py-6`}
            onClick={() => {
              setActiveTab('videos')
              navigate(`/users/${params.id}?videos`)
            }}
          >
            {activeTab === 'videos' ? <VideosActiveIcon /> : <VideosIcon />}
            <span
              className={`${
                activeTab !== 'videos' && 'text-philippinegray'
              } uppercase ml-1 font-semibold tracking-tighter-[1px]`}
            >
              videos
            </span>
          </button>
          {/* tagged tab */}
          <button
            className={`${
              activeTab === 'tagged' && 'border-t'
            } text-xs flex items-center  py-6`}
            onClick={() => {
              setActiveTab('tagged')
              navigate(`/users/${params.id}?tagged`)
            }}
          >
            {activeTab === 'tagged' ? <TaggedActiveIcon /> : <TaggedIcon />}
            <span
              className={`${
                activeTab !== 'tagged' && 'text-philippinegray'
              } uppercase ml-1 font-semibold tracking-tighter-[1px]`}
            >
              tagged
            </span>
          </button>
        </div>

        {/* content */}
        {activeTab === 'posts' && (
          <UsersPost posts={posts} postsLoading={postsLoading} user={user} />
        )}
        {activeTab === 'videos' && <UsersVideos />}
        {activeTab === 'tagged' && <UsersTagged />}
      </div>

      <PublicFooter />
    </section>
  )
}

export default UserProfile
