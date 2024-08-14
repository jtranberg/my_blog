import {useState} from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  async function register(ev) {
    ev.preventDefault();

    console.log("form submitted");
    console.log("username",username);
    console.log("password",password);

    try{
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({username,password}),
        headers: {'Content-Type':'application/json'},
      });
      console.log("Response status:",response.status);
      
      if (response.ok) {
        alert('registration successful');
      } else {
        const errorData = await response.json();
        console.error("Registration failed:",errorData);
        alert('registration failed');
      }
    }catch(error){
      console.error("Error occurred during registration:",error);
      alert("An error occurred please try again later")
      
    }
    
    
    
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Register</button>
    </form>
  );
}