import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { auth, db } from '../config/firebase.config'
import { collection, getDocs, query, where, limit } from 'firebase/firestore'
import { useOutsideClick } from '../hooks/useOutsideClick'
import { useDebounce } from '../hooks/useDebounce'
import logo from '../assets/images/nav-logo.png'
import clear from '../assets/images/clear.png'
import { ReactComponent as Home } from '../assets/icons/home.svg'
import { ReactComponent as HomeActive } from '../assets/icons/home-active.svg'
import { ReactComponent as DM } from '../assets/icons/dm.svg'
import { ReactComponent as DMActive } from '../assets/icons/dm-active.svg'
import { ReactComponent as Post } from '../assets/icons/post.svg'
import { ReactComponent as PostActive } from '../assets/icons/post-active.svg'
import { ReactComponent as Find } from '../assets/icons/find.svg'
import { ReactComponent as FindActive } from '../assets/icons/find-active.svg'
import { ReactComponent as Activity } from '../assets/icons/activity.svg'
import { ReactComponent as ActivityActive } from '../assets/icons/activity-active.svg'
import { ReactComponent as Search } from '../assets/icons/search.svg'
import { ReactComponent as Profile } from '../assets/icons/profile.svg'
import { ReactComponent as Saved } from '../assets/icons/saved.svg'
import { ReactComponent as Settings } from '../assets/icons/settings.svg'
import { ReactComponent as Switch } from '../assets/icons/switch.svg'
import NewPost from '../components/NewPost'

const Header = () => {
  const location = useLocation()
  const currentPath = location.pathname.slice(1)
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [showSearchIcon, setShowSearchIcon] = useState(true)
  const [activeLink, setActiveLink] = useState(currentPath)
  const [searchResults, setSearchResults] = useState([])
  const [openPostModal, setOpenPostModal] = useState(false)

  const profileRef = useRef()

  useOutsideClick(profileRef, () => {
    if (activeLink === 'profile') setActiveLink(currentPath)
  })

  const handleProfileClick = () => {
    if (activeLink === 'profile') setActiveLink(currentPath)
    else setActiveLink('profile')
  }

  const logout = () => {
    auth.signOut()
    navigate('/login')
  }

  useDebounce(
    async () => {
      if (search) {
        const searchCapitalized =
          search.charAt(0).toUpperCase() + search.slice(1)
        const usersRef = collection(db, 'users')
        const q = query(
          usersRef,
          where('userName', '>=', searchCapitalized),
          limit(20)
        )
        const querySnap = await getDocs(q)
        const users = []
        querySnap.forEach(doc => {
          return users.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setSearchResults(users)
      } else {
        setSearchResults('')
      }
    },
    500,
    [search]
  )

  return (
    <header className='grid place-content-center border-b border-gainsboro bg-white fixed w-full'>
      <nav className='h-[3.75rem] flex items-center justify-between px-0 sm:px-5 w-screen md:w-[48rem] xl:w-[60.9375rem]'>
        {/* instagram logo */}
        <Link to='/'>
          <img src={logo} alt='instagram' className='mt-2' />
        </Link>
        {/* Search */}
        <div className='relative bg-brightgray px-4 py-1.5 rounded-md w-[16.75rem] text-base hidden sm:block ml-[10rem]'>
          {showSearchIcon && (
            <Search className='absolute top-1/2 -translate-y-1/2' />
          )}
          {!search && (
            <label
              className={`${
                showSearchIcon && 'left-11'
              } absolute pointer-events-none top-1/2 -translate-y-1/2 text-philippinegray font-light`}
            >
              Search
            </label>
          )}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => {
              setShowSearchIcon(false)
              setSearchFocused(true)
            }}
            onBlur={() => {
              setShowSearchIcon(true)
              setTimeout(() => {
                setSearchFocused(false)
              }, 150)
            }}
            className={`${
              showSearchIcon && search && 'ml-6 text-philippinegray'
            } bg-brightgray outline-0`}
          />
          {searchFocused && (
            <img
              src={clear}
              alt='clear'
              className='absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer'
              onClick={() => setSearch('')}
            />
          )}
          {/* search results */}
          {searchFocused && (
            <>
              <div className='absolute h-5 w-5 bg-white -rotate-45 left-1/2 -translate-x-1/2 top-[2.6rem] shadow-[0_0_5px_1px_rgba(0,0,0,0.0975)]'></div>
              <div className='absolute top-12 left-1/2 -translate-x-1/2 bg-white w-[360px] h-[21.875rem] overflow-hidden overflow-y-scroll rounded shadow-[0_0_5px_1px_rgba(0,0,0,0.0975)] py-2'>
                {searchResults.length !== 0 &&
                  searchResults.map(result => (
                    <Link
                      to={`/users/${result.id}`}
                      className='px-2 py-2 flex items-center text-sm hover:bg-lotion'
                      key={result.id}
                    >
                      <img
                        src={result.data.photoURL}
                        alt='profile'
                        className='w-11 h-11 object-cover rounded-full'
                      />
                      <div className='ml-4 leading-[1.125rem]'>
                        <div className='font-semibold'>
                          {result.data.userName}
                        </div>
                        <div className='text-philippinegray'>
                          {result.data.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                {searchResults.length === 0 && search && (
                  <div className='text-sm absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
                    No results found.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {/* icons */}
        <div className='flex items-center justify-center space-x-5 sm:space-x-[1.32rem]'>
          <Link to='/'>{activeLink === '' ? <HomeActive /> : <Home />}</Link>
          <Link to='/dm'>{activeLink === 'dm' ? <DMActive /> : <DM />}</Link>
          <button onClick={() => setOpenPostModal(true)} className='outline-0'>
            {activeLink === 'post' ? <PostActive /> : <Post />}
          </button>
          <NewPost
            openPostModal={openPostModal}
            setOpenPostModal={setOpenPostModal}
          />
          <Link to='/find'>
            {activeLink === 'find' ? <FindActive /> : <Find />}
          </Link>
          <Link to='/activity'>
            {activeLink === 'activity' ? <ActivityActive /> : <Activity />}
          </Link>
          <div
            ref={profileRef}
            className={`${
              activeLink === 'profile' || currentPath === 'userprofile'
                ? 'border-raisinblack'
                : 'border-transparent'
            }
            } border p-[1px] rounded-full cursor-pointer relative`}
            onClick={handleProfileClick}
          >
            <img
              src={auth.currentUser.photoURL}
              alt='profile'
              className='w-6 h-6 rounded-full object-cover'
            />
            {activeLink === 'profile' && (
              <>
                <div className='absolute h-5 w-5 bg-white -rotate-45 right-[0.2rem] top-[2.2rem] shadow-[0_0_5px_1px_rgba(0,0,0,0.0975)]'></div>
                <div className='absolute bg-white -right-4 top-[2.5rem] rounded w-[14.375rem] py-1 shadow-[0_0_5px_1px_rgba(0,0,0,0.0975)]'>
                  <Link
                    to='/userprofile'
                    className='flex items-center space-x-2 px-4 py-2 hover:bg-lotion'
                  >
                    <Profile />
                    <div>Profile</div>
                  </Link>
                  <Link
                    to='/userprofile?saved'
                    className='flex items-center space-x-2 px-4 py-2 hover:bg-lotion'
                  >
                    <Saved />
                    <div>Saved</div>
                  </Link>
                  <Link
                    to='/editprofile'
                    className='flex items-center space-x-2 px-4 py-2 hover:bg-lotion'
                  >
                    <Settings />
                    <div>Settings</div>
                  </Link>
                  <div className='flex items-center space-x-2 px-4 py-2 mb-1 hover:bg-lotion'>
                    <Switch />
                    <div onClick={logout}>Switch Accounts</div>
                  </div>
                  <div
                    className='px-4 py-2 border-t border-gainsboro hover:bg-lotion'
                    onClick={logout}
                  >
                    Log Out
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
