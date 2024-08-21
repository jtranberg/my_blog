import { useEffect, useState } from 'react';
import Post from '../Components/Post';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('http://localhost:4000/user-posts', {
          credentials: 'include', // Include cookies for authentication
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched posts:', data); // Confirm data in console
          setPosts(data); // Update state with fetched posts
        } else {
          console.error('Failed to fetch posts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }

    fetchPosts(); // Fetch posts when component mounts
  }, []);

  return (
    <div>
      <h1>User Posts</h1>
      {posts.length > 0 ? (
        posts.map(post => (
          <Post key={post._id} {...post} />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}
