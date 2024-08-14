import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {UserContext} from "../UserContext";

export default function LoginPage() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    console.log("Login attempt for",username);

    try{
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: {'Content-Type':'application/json'},
        credentials: 'include',
      });
      console.log("Response status",response.status);
      
      if (response.ok) {
        const userInfo = await response.json();
        console.log("login successful:",userInfo);
          setUserInfo(userInfo);
          setRedirect(true)
      } else {
        console.log("login failed",await response.json);
        
        alert('wrong credentials');
      }
    }catch(error){
      console.error("Error during login",error);
      alert("An error occurred please try again later");
      
    }
    }
    

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Login</button>
    </form>
  );
}