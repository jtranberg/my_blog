import './App.css';
import Post from './Components/Post.js'
import {Route,Routes} from 'react-router-dom'
import IndexPage from './Pages/IndexPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import Layout from './Components/Layout.js';
import { UserContextProvider } from './UserContext.js';
import CreatePost from './Pages/CreatePost.js';
function App() {
 
  return (
    
    <UserContextProvider>
    <Routes>
    <Route path='/' element={<Layout/>}>
    <Route index element={
        <IndexPage />
    }/>
    <Route path='/login' element={<LoginPage/>}/>
     <Route path='/register' element={<RegisterPage/>}/>
     <Route path='/create' element = {<CreatePost/>}/>
     </Route>
  </Routes>
  </UserContextProvider>
   
    
  );
}

export default App;
