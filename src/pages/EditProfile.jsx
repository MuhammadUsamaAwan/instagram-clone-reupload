import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReactComponent as Meta } from '../assets/icons/meta.svg'
import ChangePassword from './components/editprofile/ChangePassword'
import ProfileEdit from './components/editprofile/ProfileEdit'
import PublicFooter from '../layouts/PublicFooter'
import NoImplementationYet from './components/editprofile/NoImplementationYet'

const EditProfile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTable] = useState(
    location.search.slice(1) ? location.search.slice(1) : 'editProfile'
  )
  return (
    <>
      <section className='grid place-content-center'>
        <div className='py-4 px-0 sm:px-5 w-screen md:w-[48rem] xl:w-[60.9375rem]'>
          <div className='flex'>
            {/* menu */}
            <div className='flex-1 text-base border border-gainsboro bg-white hidden sm:block'>
              <div
                className={`${
                  activeTab === 'editProfile'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('editProfile')
                  navigate('/editprofile?editProfile')
                }}
              >
                Edit Profile
              </div>
              <div
                className={`${
                  activeTab === 'changePassword'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('changePassword')
                  navigate('/editprofile?changePassword')
                }}
              >
                Change Password
              </div>
              <div
                className={`${
                  activeTab === 'appsWebsites'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('appsWebsites')
                  navigate('/editprofile?appsWebsites')
                }}
              >
                Apps & Websites
              </div>
              <div
                className={`${
                  activeTab === 'emailNotifications'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('emailNotifications')
                  navigate('/editprofile?emailNotifications')
                }}
              >
                Email Notifications
              </div>
              <div
                className={`${
                  activeTab === 'pushNotifications'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('pushNotifications')
                  navigate('/editprofile?pushNotifications')
                }}
              >
                Push Notifications
              </div>
              <div
                className={`${
                  activeTab === 'manageContacts'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('manageContacts')
                  navigate('/editprofile?manageContacts')
                }}
              >
                Manage Contacts
              </div>
              <div
                className={`${
                  activeTab === 'privacySecurity'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('privacySecurity')
                  navigate('/editprofile?privacySecurity')
                }}
              >
                Privacy and Security
              </div>
              <div
                className={`${
                  activeTab === 'loginActivity'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('loginActivity')
                  navigate('/editprofile?loginActivity')
                }}
              >
                Login Activity
              </div>
              <div
                className={`${
                  activeTab === 'emailsInstagram'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('emailsInstagram')
                  navigate('/editprofile?emailsInstagram')
                }}
              >
                Email From Instagram
              </div>
              <div
                className={`${
                  activeTab === 'help'
                    ? 'border-raisinblack hover:border-raisinblack font-semibold'
                    : 'border-transparent hover:border-chinesesilver hover:bg-lotion'
                } pl-[1.875rem] pr-4 py-3.5 border-l-2 cursor-pointer`}
                onClick={() => {
                  setActiveTable('help')
                  navigate('/editprofile?help')
                }}
              >
                Help
              </div>
              <div className='text-vividcerulean font-semibold pl-[1.875rem] pr-4 py-4 text-center text-sm mb-4'>
                Switch to Professional Account
              </div>
              <div className='border-t border-gainsboro'>
                <div>
                  <Meta
                    width={60}
                    height={12}
                    className='ml-[1.875rem] mr-4 mt-6'
                  />
                  <div className='text-vividcerulean font-semibold pl-[1.875rem] pr-4 py-2'>
                    Accounts Center
                  </div>
                  <p className='pl-[1.875rem] pr-4 pb-4 text-xs text-philippinegray'>
                    Control settings for connected experiences across Instagram,
                    the Facebook app and Messenger, including story and post
                    sharing and logging in.
                  </p>
                </div>
              </div>
            </div>
            {/* content */}
            <div className='flex-[3] sm:border-t sm:border-b sm:border-r border-gainsboro sm:py-8 sm:px-10 px-2 bg-transparent sm:bg-white border-0'>
              {activeTab === 'editProfile' && <ProfileEdit />}
              {activeTab === 'changePassword' && <ChangePassword />}
              {activeTab !== 'editProfile' &&
                activeTab !== 'changePassword' && <NoImplementationYet />}
            </div>
          </div>
        </div>
      </section>
      <PublicFooter />
    </>
  )
}

export default EditProfile
