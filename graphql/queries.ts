import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      body
      created_at
      id
      image
      subreddit_id
      title
      username
      comments {
        id
        text
        username
      }
      votes {
        id
        upvote
        username
        created_at
      }
      subreddit {
        created_at
        id
        topic
      }
    }
  }
`;

export const GET_POSTS_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getPostListByPostId(post_id: $post_id) {
      body
      created_at
      id
      image
      subreddit_id
      title
      username
      comments {
        id
        text
        username,
        created_at,
        post_id
      }
      votes {
        id
        upvote
        username
        created_at
      }
      subreddit {
        created_at
        id
        topic
      }
    }
  }
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      body
      created_at
      id
      image
      subreddit_id
      title
      username
      comments {
        id
        text
        username
      }
      votes {
        id
        upvote
        username
        created_at
      }
      subreddit {
        created_at
        id
        topic
      }
    }
  }
`;

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`

