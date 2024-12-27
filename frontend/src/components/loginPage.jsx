const LoginPage = () =>{
  return(
    <div className="loginForm">
      <label htmlFor='username'>Username: </label>
     <input type='text' id='username' placeholder='Enter your username' ></input>

     <label htmlFor='password'>Password</label>
     <input type='password' placeholder='Enter your password' id='password'></input>
    </div>
  )
};
export default LoginPage;