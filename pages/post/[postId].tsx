import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import React from 'react'
import { GET_POSTS_BY_POST_ID } from '../../graphql/queries'

function PostPage() {
  const router = useRouter()
  const { loading, error, data } = useQuery(GET_POSTS_BY_POST_ID, {
    variables: {
      post_id: router.query.postId
    }
  })

  return (
    <div>

    </div>
  )
}

export default PostPage