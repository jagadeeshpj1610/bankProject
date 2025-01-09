import React from 'react'

function Logout() {
  return (
  <>
  <div className='logoutPopup' >
    <p> Do you want to exit ?</p>
    <div className='logoutbuttons' >
      <button className='cancel'>Cancel</button>
      <button className='logout'>Logout</button>
    </div>
  </div>
  </>
  )
}

export default Logout