import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string,
  postBody: string,
  postImage: string,
  subreddit: string
}

function PostBox() {
  const { data: session } = useSession()
  const [addPost] = useMutation(ADD_POST)
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const [ imageBoxOpen, setImageBoxOpen ] = useState(false)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async formData => {
    const notification = toast.loading('Creating new post...')
    try {
      const { data: { getSubredditListByTopic } } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: formData.subreddit
        }
      })

      const subredditExists = getSubredditListByTopic.length > 0;
      console.log('Subreddits: ', getSubredditListByTopic);


      if (!subredditExists) {
        console.log('Creating a new subreddit!');
        const { data: { insertSubreddit: newSubreddit }} = await addSubreddit({
          variables: {
            topic: formData.subreddit
          }
        })

        console.log('Creating post...', formData);
        const image = formData.postImage || '';
        const { data: { insertPost: newPost } } = await addPost({
          variables: {
            image: image,
            body: formData.postBody,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })

        console.log('New post added', newPost);

      } else {
        const image = formData.postImage || '';
        console.log('Creating new post: ', formData);
        const { data: { insertPost: newPost } } = await addPost({
          variables: {
            image: image,
            body: formData.postBody,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })
      }

      setValue('postBody', '')
      setValue('postTitle', '')
      setValue('postImage', '')
      setValue('subreddit', '')
      toast.success('New post created!', {
        id: notification
      })
    } catch (error) {
      toast.error('Something went wrong!', {
        id: notification
      })
    }
  })

  return (
    <form onSubmit={onSubmit} className='sticky top-16 z-50 bg-white border rounded-md border-gray-300 p-2'>
      <div className='flex items-center space-x-3'>
        {/* Avatar */}
        <Avatar />
        <input
          {...register('postTitle', { required: true })}
          type="text"
          disabled={!session}
          className='flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none'
          placeholder={
            session ? 'Create a new post by entering a title!' : 'Sign in to post!'
        }/>

        <PhotographIcon
          className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-300'}`}
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
        />
        <LinkIcon className='h-6 text-gray-300'/>
      </div>

      {watch('postTitle') && (
        <div className='flex flex-col py-2'>
          {/* Body */}
          <div className='flex items-center px-2'>
            <p className='min-w-[90px]'>Body</p>
            <input
              className='m-2 flex-1 bg-blue-50 p-2 outline-none'
              {...register('postBody')}
              type="text"
              placeholder='Text (optional)'
            />
          </div>
          {/* Subreddit */}
          <div className='flex items-center px-2'>
            <p className='min-w-[90px]'>Subreddit</p>
            <input
              className='m-2 flex-1 bg-blue-50 p-2 outline-none'
              {...register('subreddit', { required: true })}
              type="text"
              placeholder='i.e. reactjs'
            />
          </div>
          {/* ImageBox */}
          {imageBoxOpen && (
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Image URL</p>
              <input
                className='m-2 flex-1 bg-blue-50 p-2 outline-none'
                {...register('postImage')}
                type="text"
                placeholder='Optional'
              />
            </div>
          )}

          {/* Errors */}
          {Object.keys(errors).length > 0 && (
            <div className='space-y-2 p-2 text-red-500'>
              {errors.postTitle?.type === 'required' && (
                <p>- A post title is required.</p>
              )}

              {errors.subreddit?.type === 'required' && (
                <p>- A subreddit is required.</p>
              )}
            </div>
          )}

          {!!watch('postTitle') && (
            <button className='w-full rounded-full bg-blue-400 p-2 text-white' type='submit'>Create post</button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox