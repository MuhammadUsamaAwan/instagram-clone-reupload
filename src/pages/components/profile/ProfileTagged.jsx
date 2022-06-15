import taggedImg from '../../../assets/images/tagged.png'

const ProfileTagged = () => {
  return (
    <div>
      <div className='flex flex-col items-center justify-center mt-12'>
        <img src={taggedImg} alt='tagged' />
        <h1 className='font-light text-[1.75rem] my-4'>Photos of you</h1>
        <p className='max-w-[21.875rem]'>
          When people tag you in photos, they'll appear here.
        </p>
      </div>
    </div>
  )
}

export default ProfileTagged
