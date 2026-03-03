import React from 'react'

function PostCard({post}) {
  return (
    <div className='border p-2 rounded-2xl border-gray-100 shadow-sm'>
        <div className='flex'>
            <div className='rounded-full w-10 h-10 overflow-hidden object-cover'>
                <img src={post.uploader.profilePic} alt="" className='w-full h-full' />
            </div>
            <h3>{post.uploader.fullname}</h3>
        </div>
        <h1>{post.description}</h1>
        <img src={post.imageURL} alt="" />
    </div>
  )
}

export default PostCard