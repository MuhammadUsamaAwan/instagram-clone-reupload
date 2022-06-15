import { useEffect, useState } from 'react'
import { auth, db } from '../config/firebase.config'
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import HomePost from './components/home/HomePost'
import HomeFooter from './components/home/HomeFooter'
import seen from '../assets/images/seen.png'

const Home = () => {
  const [currentUser, setCurrentUser] = useState({})
  const [posts, setPosts] = useState([])

  const getData = async () => {
    const docRef = doc(db, 'users', auth.currentUser.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setCurrentUser(docSnap.data())
      if (docSnap.data().following) {
        const postsRef = collection(db, 'posts')
        const q = query(
          postsRef,
          where('userRef', 'in', docSnap.data().following)
        )
        const querySnap = await getDocs(q)
        const posts = []
        querySnap.forEach(doc => {
          return posts.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setPosts(posts)
      }
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className='grid place-content-center'>
      <div className='mt-[1.875rem] flex items-start w-full md:w-[470px] lg:w-[821px]'>
        <div className='flex-[3] mr-0 lg:mr-2 space-y-3'>
          {posts.map(post => (
            <HomePost key={post.id} id={post.id} data={post.data} />
          ))}
          <div
            className='flex flex-col items-center space-y-3'
            style={{ margin: '3rem 0' }}
          >
            <img src={seen} alt='seen' />
            <p>
              You've seen all posts. Follow more accounts to see more posts!
            </p>
          </div>
        </div>
        <div className='md:hidden hidden flex-[2] lg:block'>
          <Link to='/userprofile' className='space-x-4 items-center flex'>
            <img
              src={auth.currentUser.photoURL}
              alt='avatar'
              className='rounded-full object-cover h-[3.5rem] w-[3.5rem]'
            />
            <div>
              <div className='font-semibold'>
                {auth.currentUser.displayName}
              </div>
              <div className='text-philippinegray'>{currentUser?.name}</div>
            </div>
            <button className='text-vividcerulean font-semibold flex-1 font-xs text-right pr-4'>
              Switch
            </button>
          </Link>
          <HomeFooter />
        </div>
      </div>
    </section>
  )
}

export default Home
