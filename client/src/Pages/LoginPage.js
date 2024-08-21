import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  // Function to fetch user's posts after login
  async function fetchUserPosts() {
    try {
      const response = await fetch('http://localhost:4000/user-posts', {
        credentials: 'include', // Send cookies along with the request
      });
      if (response.ok) {
        const posts = await response.json();
        console.log('User posts:', posts);
        // You can store the posts in context or state if needed
      } else {
        console.error('Failed to fetch posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  }

  // Login function
  async function login(event) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          const userInfo = await response.json();
          setUserInfo(userInfo);
          await fetchUserPosts(); // Fetch posts after login
          setRedirect(true);
        } else {
          console.error('Expected JSON, got:', contentType);
          alert('An unexpected response was received. Please try again later.');
        }
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={ev => setUsername(ev.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={ev => setPassword(ev.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
