import '../css/login.css'

const LoginPage = () =>{
  return(
   <div className='loginFormMainContainer' >
     <div className="loginForm">
      <div className='userNameContainer' >
        <label htmlFor='username'>Username: </label>
        <input type='text' id='username' placeholder='Enter your username' ></input>
      </div>
   <div className='passwordContainer' >
     <label htmlFor='password'>Password: </label>
     <input type='password' placeholder='Enter your password' id='password'></input>
   </div>
   <button className='loginButton' >Login</button>
    </div>
   </div>
  )
};
export default LoginPage;