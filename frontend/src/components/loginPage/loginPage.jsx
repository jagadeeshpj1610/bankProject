import '../header/header.css'

const LoginPage = () =>{
  return(
    <div className="loginForm">
      <table>
        <tr>
        <td><label htmlFor="userName">UserName:</label></td>
        <td><input type="text" /></td>
        </tr>
        <tr>
        <td><label htmlFor="passWord">password:</label></td>
        <td><input type="password" /></td>
        </tr>
      </table>
    </div>
  )
};

export default LoginPage;