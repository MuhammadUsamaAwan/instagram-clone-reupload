import savedImg from '../../../assets/images/saved.png'

const ProfileSaved = () => {
  return (
    <div className='mt-4'>
      <div className='flex justify-between items-center'>
        <div className='text-philippinegray text-xs'>
          Only you can see what you've saved
        </div>
        <button className='text-vividcerulean font-semibold'>
          + New Collection
        </button>
      </div>
      <div className='flex flex-col items-center justify-center mt-24'>
        <div>
          <img src={savedImg} alt='saved' />
        </div>
        <h1 className='font-light text-[1.75rem] my-4'>Save</h1>
        <p className='max-w-[21.875rem]'>
          Save photos and videos that you want to see again. No one is notified,
          and only you can see what you've saved.
        </p>
      </div>
    </div>
  )
}

export default ProfileSaved
