import '../css/login.css'
import { Link } from 'react-router-dom'
import { Signup } from './Signup';

const LoginPage = () =>{
  return(
    <>
   <div className='loginFormMainContainer' >
     <div className="loginForm">
      <div className='userNameContainer' >
        <label htmlFor='username'>Username: </label>
        <input type='text' id='username' placeholder='Enter your username' ></input>
      </div>
   <div className='passwordContainer' >
     <label htmlFor='password'>Password:</label>
     <input type='password' placeholder='Enter your password' id='password'></input>
   </div>
  <Link to= '/home'><button className='loginButton' >Login</button> </Link>
  <Link  to= '/signup'>Signup</Link>
    </div>
   </div>
   </>
  )
};
export default LoginPage;