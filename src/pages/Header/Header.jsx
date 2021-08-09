import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className={"Header"}>
        <div className={"wrapper"}>
          <h1 className={"header__text"} style={{color: '#E1E5E9', margin: '10px 0px 12px 0px'}}>Face<span >IT</span> Finder</h1>
        </div>
    </div>
  )
}

export default Header