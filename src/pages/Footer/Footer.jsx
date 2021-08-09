import React from 'react'
import './Footer.css'
import * as url from 'url';

const Footer = () => {

  const clickHandler = async (e) => {
    e.preventDefault()
    chrome.tabs.create({url: "https://steamcommunity.com/id/-dead1nside-"})
  }

  return (
    <div className={"Footer"}>
      <div className={"wrapper"}>
        <div className={'developed'}>
            <h3>Developed by: <a className={'link'} onClick={clickHandler}>markfixgg</a></h3>
        </div>
      </div>
    </div>
  )
}

export default Footer