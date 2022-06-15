import { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../config/firebase.config'
import { collection, query, where, doc, onSnapshot } from 'firebase/firestore'
import { ReactComponent as Settings } from '../assets/icons/settings.svg'
import { ReactComponent as PostsIcon } from '../assets/icons/posts-profile.svg'
import { ReactComponent as PostsActiveIcon } from '../assets/icons/posts-profile-active.svg'
import { ReactComponent as SavedIcon } from '../assets/icons/saved-profile.svg'
import { ReactComponent as SavedActiveIcon } from '../assets/icons/saved-profile-active.svg'
import { ReactComponent as TaggedIcon } from '../assets/icons/tagged.svg'
import { ReactComponent as TaggedActiveIcon } from '../assets/icons/tagged-active.svg'
import ProfilePosts from './components/profile/ProfilePosts'
import ProfileSaved from './components/profile/ProfileSaved'
import ProfileTagged from './components/profile/ProfileTagged'
import PublicFooter from '../layouts/PublicFooter'
import Modal from 'react-modal'
import Followers from '../components/Followers'
import Following from '../components/Following'

const Profile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState({})
  const [activeTab, setActiveTab] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [openFollowersModal, setOpenFollowersModal] = useState(false)
  const [openFollowingModal, setOpenFollowingModal] = useState(false)

  const getProfile = async () => {
    onSnapshot(doc(db, 'users', auth.currentUser.uid), doc => {
      setCurrentUser(doc.data())
    })
  }

  const getPosts = async () => {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, where('userRef', '==', auth.currentUser.uid))
    onSnapshot(q, querySnapshot => {
      const posts = []
      querySnapshot.forEach(doc => {
        posts.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setPosts(posts)
      setPostsLoading(false)
    })
  }

  useEffect(() => {
    getProfile()
    getPosts()
  }, [onSnapshot])

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
              src={auth.currentUser.photoURL}
              alt='avatar'
              loading='lazy'
              className='h-[4.6875rem] sm:h-[9.375rem] w-[4.6875rem] sm:w-[9.375rem] rounded-full object-cover ml-0 sm:ml-14'
            />
          </div>

          <div className='flex-[2] space-y-4'>
            <div>
              <div className='flex items-center space-x-6'>
                <h2 className='text-[1.75rem] font-light'>
                  {auth.currentUser.displayName}
                </h2>
                <button className='font-semibold rounded border border-gainsboro py-[0.3125rem] px-[0.5625rem] hidden sm:block'>
                  <Link to='/editprofile'>Edit Profile</Link>
                </button>
                <button
                  onClick={() => setOpenModal(true)}
                  className='outline-0'
                >
                  <Settings width={24} height={24} />
                </button>
                <Modal
                  isOpen={openModal}
                  onRequestClose={() => setOpenModal(false)}
                  closeTimeoutMS={100}
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
                    <Link
                      to='/editprofile?changePassword'
                      className='w-full p-3.5 border-b border-gainsboro'
                    >
                      Change Password
                    </Link>
                    <div className='w-full p-3.5 border-b border-gainsboro'>
                      QR Code
                    </div>
                    <Link
                      to='/editprofile?appsWebsites'
                      className='w-full p-3.5 border-b border-gainsboro'
                    >
                      Apps and Websites
                    </Link>
                    <Link
                      to='/editprofile?emailNotifications'
                      className='w-full p-3.5 border-b border-gainsboro'
                    >
                      Notifications
                    </Link>
                    <Link
                      to='/editprofile?privacySecurity'
                      className='w-full p-3.5 border-b border-gainsboro'
                    >
                      Privacy & Security
                    </Link>
                    <Link
                      to='/editprofile?loginActivity'
                      className='w-full p-3.5 border-b border-gainsboro'
                    >
                      Login activity
                    </Link>
                    <Link
                      to='/editprofile?emailsInstagram'
                      className='w-full p-3.5 border-b border-gainsboro'
                    >
                      Emails from Instagram
                    </Link>
                    <Link
                      to='/editprofile?help'
                      className='w-full p-3.5 border-b border-gainsboro'
                    >
                      Report a Problem
                    </Link>
                    <button className='w-full p-3.5 border-b border-gainsboro'>
                      Embed
                    </button>
                    <button
                      className='w-full p-3.5 border-b border-gainsboro'
                      onClick={() => {
                        auth.signOut()
                        navigate('/login')
                      }}
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => setOpenModal(false)}
                      className='flex-1 p-3.5'
                    >
                      Cancel
                    </button>
                  </div>
                </Modal>
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
                disabled={!currentUser?.followers}
              >
                <span className='font-semibold mr-1'>
                  {currentUser?.followers ? currentUser?.followers.length : 0}
                </span>
                followers
              </button>
              <button
                onClick={() => setOpenFollowingModal(true)}
                disabled={!currentUser?.following}
              >
                <span className='font-semibold mr-1'>
                  {currentUser?.following ? currentUser?.following.length : 0}
                </span>
                following
              </button>
            </div>

            {/* modals */}
            <Followers
              openFollowersModal={openFollowersModal}
              setOpenFollowersModal={setOpenFollowersModal}
              userId={auth.currentUser.uid}
            />
            <Following
              openFollowingModal={openFollowingModal}
              setOpenFollowingModal={setOpenFollowingModal}
              userId={auth.currentUser.uid}
            />

            <div className='text-base'>
              <div className='font-semibold'>{currentUser?.name}</div>
              {currentUser.bio && <div>{currentUser.bio}</div>}
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
              navigate('/userprofile?posts')
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
          {/* saved tab */}
          <button
            className={`${
              activeTab === 'saved' && 'border-t'
            } text-xs flex items-center py-6`}
            onClick={() => {
              setActiveTab('saved')
              navigate('/userprofile?saved')
            }}
          >
            {activeTab === 'saved' ? <SavedActiveIcon /> : <SavedIcon />}
            <span
              className={`${
                activeTab !== 'saved' && 'text-philippinegray'
              } uppercase ml-1 font-semibold tracking-tighter-[1px]`}
            >
              saved
            </span>
          </button>
          {/* tagged tab */}
          <button
            className={`${
              activeTab === 'tagged' && 'border-t'
            } text-xs flex items-center  py-6`}
            onClick={() => {
              setActiveTab('tagged')
              navigate('/userprofile?tagged')
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
          <ProfilePosts
            posts={posts}
            postsLoading={postsLoading}
            currentUser={currentUser}
          />
        )}
        {activeTab === 'saved' && <ProfileSaved />}
        {activeTab === 'tagged' && <ProfileTagged />}
      </div>

      <PublicFooter />
    </section>
  )
}

export default Profile
