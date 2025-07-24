import React from 'react'

function User({isLoggedIn }) {
  return (
    <div>
      <h1>{isLoggedIn?"Welcome, User":"Please Login"}</h1>
    </div>
  )
}

export default User
