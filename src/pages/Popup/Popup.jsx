import React, { useEffect, useState } from 'react';
import './Popup.css';
import { sendBackgroundMessage } from '../Content/modules/backgroundMessages';
import Header from '../Header/Header'
import Body from '../Body/Body'
import Footer from '../Footer/Footer'

import background_inferno from '../../assets/img/background_inferno.png'

const Popup = () => {
  return (
    <div className="App" style={{background: `#282c34 url(${background_inferno})`}}>
      <Header/>
      <Body/>
      <Footer/>
    </div>
  );
};

export default Popup;
